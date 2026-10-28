-- Core schema for MR SHOP (Cash on Delivery only). Money is integer paise.
-- Order placement, status transitions and stock changes are added as functions in later phases.

create type public.product_status as enum ('draft', 'published', 'archived');
create type public.order_status as enum (
  'placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled',
  'delivery_failed', 'returned_to_origin', 'return_requested', 'returned'
);
create type public.payment_status as enum (
  'cod_pending', 'collected', 'not_collected', 'void', 'refund_due', 'refunded'
);
create type public.return_kind as enum ('return', 'exchange');
create type public.return_status as enum ('requested', 'approved', 'rejected', 'received', 'refunded', 'completed');

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Single authorized administrator(s). Rows are created by the owner in the database, never by signup.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- Business rules as settings, not hard-coded constants (approved values, see docs/decision-log.md).
create table public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create trigger settings_updated before update on public.settings
  for each row execute function public.set_updated_at();

insert into public.settings (key, value) values
  ('max_cod_order_value_paise', '500000'),
  ('flat_shipping_paise', '7900'),
  ('free_shipping_threshold_paise', '199900'),
  ('cod_fee_paise', '0'),
  ('max_items_per_order', '10'),
  ('max_open_cod_orders_per_phone', '2'),
  ('auto_cancel_unconfirmed_hours', '48'),
  ('returns_window_days', '3');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  slug text not null unique,
  name text not null,
  description text not null default '',
  fabric_and_care text not null default '',
  gst_rate_bps integer not null check (gst_rate_bps between 0 and 10000),
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products (category_id);
create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete restrict,
  sku text not null unique,
  size text not null,
  colour text not null,
  price_paise integer not null check (price_paise > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (product_id, size, colour)
);
create index product_variants_product_idx on public.product_variants (product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  colour text,
  storage_path text not null,
  alt_text text not null default '',
  display_order integer not null default 0
);
create index product_images_product_idx on public.product_images (product_id);

create table public.inventory (
  variant_id uuid primary key references public.product_variants (id) on delete restrict,
  available integer not null default 0 check (available >= 0),
  updated_at timestamptz not null default now()
);

create table public.inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  change integer not null check (change <> 0),
  reason text not null,
  actor uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index inventory_adjustments_variant_idx on public.inventory_adjustments (variant_id);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null check (pincode ~ '^[1-9][0-9]{5}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses (user_id);

create table public.cod_pincodes (
  pincode text primary key check (pincode ~ '^[1-9][0-9]{5}$'),
  is_active boolean not null default true,
  shipping_override_paise integer check (shipping_override_paise is null or shipping_override_paise >= 0)
);

create sequence public.order_number_seq start 1000;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique
    default ('MR-' || to_char(nextval('public.order_number_seq'), 'FM000000')),
  user_id uuid not null references auth.users (id) on delete restrict,
  idempotency_key text not null,
  status public.order_status not null default 'placed',
  subtotal_paise integer not null check (subtotal_paise >= 0),
  shipping_paise integer not null check (shipping_paise >= 0),
  cod_fee_paise integer not null default 0 check (cod_fee_paise >= 0),
  gst_included_paise integer not null default 0 check (gst_included_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  address_snapshot jsonb not null,
  courier_name text,
  tracking_number text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, idempotency_key),
  check (total_paise = subtotal_paise + shipping_paise + cod_fee_paise),
  -- shipped (and later outcomes that follow shipping) require courier and tracking
  check (
    status not in ('shipped', 'delivered', 'delivery_failed', 'returned_to_origin', 'return_requested', 'returned')
    or (courier_name is not null and tracking_number is not null)
  )
);
create index orders_user_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index orders_phone_idx on public.orders (phone);
create trigger orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  product_name text not null,
  sku text not null,
  size text not null,
  colour text not null,
  unit_price_paise integer not null check (unit_price_paise > 0),
  quantity integer not null check (quantity > 0),
  gst_rate_bps integer not null check (gst_rate_bps between 0 and 10000)
);
create index order_items_order_idx on public.order_items (order_id);

-- Payment method is fixed to COD. No online payment identifiers are stored.
create table public.payments (
  order_id uuid primary key references public.orders (id) on delete restrict,
  method text not null default 'cod' check (method = 'cod'),
  status public.payment_status not null default 'cod_pending',
  collected_amount_paise integer check (collected_amount_paise is null or collected_amount_paise >= 0),
  collected_at timestamptz,
  check (status <> 'collected' or (collected_amount_paise is not null and collected_at is not null))
);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete restrict,
  actor uuid references auth.users (id) on delete set null,
  from_status public.order_status,
  to_status public.order_status not null,
  note text,
  created_at timestamptz not null default now()
);
create index order_events_order_idx on public.order_events (order_id);

create table public."returns" (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references public.order_items (id) on delete restrict,
  kind public.return_kind not null default 'return',
  reason text not null,
  status public.return_status not null default 'requested',
  refund_details text,
  exchange_order_id uuid references public.orders (id) on delete restrict,
  created_at timestamptz not null default now()
);
create index returns_item_idx on public."returns" (order_item_id);

-- Failed-delivery tracking per phone. The phone is stored as a hash computed on the server.
create table public.phone_flags (
  phone_hash text primary key,
  failed_delivery_count integer not null default 0 check (failed_delivery_count >= 0),
  is_blocked boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Admin-only stock adjustment: the only write path for inventory from the app in Phase 3.
create or replace function public.admin_adjust_stock(p_variant_id uuid, p_change integer, p_reason text)
returns integer
language plpgsql security definer set search_path = public as $$
declare
  new_available integer;
begin
  if not public.is_admin() then
    raise exception 'not authorized' using errcode = '42501';
  end if;
  if p_change = 0 then
    raise exception 'change must not be zero';
  end if;
  insert into public.inventory (variant_id, available) values (p_variant_id, 0)
    on conflict (variant_id) do nothing;
  update public.inventory
     set available = available + p_change, updated_at = now()
   where variant_id = p_variant_id
   returning available into new_available;   -- check constraint rejects negative stock
  insert into public.inventory_adjustments (variant_id, change, reason, actor)
    values (p_variant_id, p_change, p_reason, auth.uid());
  return new_available;
end $$;
revoke all on function public.admin_adjust_stock(uuid, integer, text) from public, anon;
grant execute on function public.admin_adjust_stock(uuid, integer, text) to authenticated;
-- Row Level Security: enabled on every table, plus explicit table grants (defence in depth).

alter table public.admin_users enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.inventory_adjustments enable row level security;
alter table public.addresses enable row level security;
alter table public.cod_pincodes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.order_events enable row level security;
alter table public."returns" enable row level security;
alter table public.phone_flags enable row level security;

-- Start from nothing, then grant only what is needed.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- Public catalog (read), admin writes enforced by policies below.
grant select on public.categories, public.products, public.product_variants,
  public.product_images, public.inventory, public.cod_pincodes to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.product_variants,
  public.product_images, public.cod_pincodes to authenticated;
-- Inventory has no direct write grant: stock changes go through database functions only.

grant select on public.inventory_adjustments, public.settings, public.admin_users,
  public.phone_flags to authenticated;
grant insert, update on public.settings to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
-- Orders, items, payments, events, returns: read-only for clients. Writes happen in security-definer functions.
grant select on public.orders, public.order_items, public.payments,
  public.order_events, public."returns" to authenticated;

-- Catalog
create policy categories_read on public.categories for select
  using (is_published or public.is_admin());
create policy categories_admin on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy products_read on public.products for select
  using (status = 'published' or public.is_admin());
create policy products_admin on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy variants_read on public.product_variants for select
  using (
    public.is_admin()
    or (is_active and exists (select 1 from public.products p where p.id = product_id and p.status = 'published'))
  );
create policy variants_admin on public.product_variants for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy images_read on public.product_images for select
  using (
    public.is_admin()
    or exists (select 1 from public.products p where p.id = product_id and p.status = 'published')
  );
create policy images_admin on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Stock levels are visible for published variants (product page shows stock per size). No write policy.
create policy inventory_read on public.inventory for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.product_variants v
      join public.products p on p.id = v.product_id
      where v.id = variant_id and v.is_active and p.status = 'published'
    )
  );

create policy adjustments_admin_read on public.inventory_adjustments for select to authenticated
  using (public.is_admin());

create policy pincodes_read on public.cod_pincodes for select
  using (is_active or public.is_admin());
create policy pincodes_admin on public.cod_pincodes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Admin-only tables
create policy admin_users_self on public.admin_users for select to authenticated
  using (public.is_admin());
create policy settings_admin_read on public.settings for select to authenticated
  using (public.is_admin());
create policy settings_admin_write on public.settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy phone_flags_admin on public.phone_flags for select to authenticated
  using (public.is_admin());

-- Customer-owned data
create policy addresses_own on public.addresses for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy orders_read on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy order_items_read on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy payments_read on public.payments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy order_events_read on public.order_events for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy returns_read on public."returns" for select to authenticated
  using (exists (
    select 1 from public.order_items i join public.orders o on o.id = i.order_id
    where i.id = order_item_id and (o.user_id = auth.uid() or public.is_admin())
  ));
-- Product images bucket: public read, admin-only write. Validate type and size in the upload action too.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy product_images_public_read on storage.objects for select
  using (bucket_id = 'product-images');
create policy product_images_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());
create policy product_images_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
create policy product_images_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
-- Demo data for development only. Not for production. GST 5% (500 bps) is a demo value, not advice.
insert into public.categories (slug, name, display_order, is_published) values
  ('casual', 'Casual', 1, true),
  ('party', 'Party', 2, true),
  ('ethnic', 'Ethnic', 3, true),
  ('office', 'Office', 4, true);

do $$
declare
  cat record;
  p_id uuid;
  v_id uuid;
  n integer := 0;
  prod text;
  sz text;
  col text;
  colours text[] := array['Plum', 'Rose'];
  sizes text[] := array['S', 'M', 'L', 'XL'];
begin
  for cat in select id, slug, name from public.categories loop
    for i in 1..2 loop
      n := n + 1;
      prod := cat.name || ' Dress ' || i;
      insert into public.products (category_id, slug, name, description, fabric_and_care, gst_rate_bps, status)
      values (cat.id, lower(cat.slug || '-dress-' || i), prod,
              'Demo ' || lower(cat.name) || ' dress.', 'Cotton blend. Machine wash cold.', 500, 'published')
      returning id into p_id;
      foreach col in array colours loop
        foreach sz in array sizes loop
          insert into public.product_variants (product_id, sku, size, colour, price_paise)
          values (p_id, upper(left(cat.slug, 3)) || '-' || i || '-' || upper(left(col, 2)) || '-' || sz,
                  sz, col, (89900 + n * 20000))
          returning id into v_id;
          insert into public.inventory (variant_id, available) values (v_id, 5 + (n % 4));
        end loop;
      end loop;
    end loop;
  end loop;
end $$;

-- Delivery is India-wide; a few demo pincodes. The admin manages the real list.
insert into public.cod_pincodes (pincode) values ('600001'), ('400001'), ('110001'), ('560001'), ('700001');
