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
