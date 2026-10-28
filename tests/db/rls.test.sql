\set ON_ERROR_STOP on
-- RLS, constraint and function tests. Run via scripts/test-db.sh after migrations and seed.

create schema tests;
grant usage on schema tests to anon, authenticated;

create function tests.eq(label text, actual anyelement, expected anyelement) returns void
language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FAIL: % (expected %, got %)', label, expected, actual;
  end if;
  raise notice 'ok: %', label;
end $$;

-- Passes only if the statement fails with the given SQLSTATE.
create function tests.denied(label text, stmt text, expected_state text default '42501') returns void
language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    if sqlstate = expected_state then
      raise notice 'ok: % (blocked: %)', label, sqlstate;
      return;
    end if;
    raise exception 'FAIL: % (wrong error %: %)', label, sqlstate, sqlerrm;
  end;
  raise exception 'FAIL: % (statement succeeded but should be blocked)', label;
end $$;
grant execute on all functions in schema tests to anon, authenticated;

-- Fixtures (superuser)
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.test'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.test'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin@example.test');
insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-0000000000ad');

insert into public.products (id, category_id, slug, name, gst_rate_bps, status)
select '10000000-0000-0000-0000-000000000001', id, 'draft-dress', 'Draft Dress', 500, 'draft'
from public.categories where slug = 'casual';
insert into public.product_variants (id, product_id, sku, size, colour, price_paise)
values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'DRAFT-1', 'M', 'Plum', 99900);
insert into public.inventory (variant_id, available) values ('20000000-0000-0000-0000-000000000001', 3);

insert into public.addresses (user_id, full_name, phone, line1, city, state, pincode) values
  ('00000000-0000-0000-0000-00000000000a', 'Customer A', '9876543210', '1 Main St', 'Chennai', 'TN', '600001'),
  ('00000000-0000-0000-0000-00000000000b', 'Customer B', '9876543211', '2 Main St', 'Mumbai', 'MH', '400001');

insert into public.orders (id, user_id, idempotency_key, subtotal_paise, shipping_paise, total_paise, phone, address_snapshot) values
  ('30000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-00000000000a', 'k-a', 100000, 0, 100000, '9876543210', '{}'),
  ('30000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-00000000000b', 'k-b', 100000, 0, 100000, '9876543211', '{}');
insert into public.payments (order_id) select id from public.orders;

-- Constraints (superuser)
select tests.denied('shipped order needs courier and tracking',
  $$update public.orders set status = 'shipped' where id = '30000000-0000-0000-0000-00000000000a'$$, '23514');
select tests.denied('payment method must be cod',
  $$insert into public.payments (order_id, method) values ('30000000-0000-0000-0000-00000000000a', 'card')$$, '23514');
select tests.denied('collected payment needs amount and date',
  $$update public.payments set status = 'collected' where order_id = '30000000-0000-0000-0000-00000000000a'$$, '23514');
select tests.denied('stock cannot be negative',
  $$update public.inventory set available = -1 where variant_id = '20000000-0000-0000-0000-000000000001'$$, '23514');
select tests.denied('order total must equal parts',
  $$insert into public.orders (user_id, idempotency_key, subtotal_paise, shipping_paise, total_paise, phone, address_snapshot)
    values ('00000000-0000-0000-0000-00000000000a', 'bad', 100, 79, 100, '9876543210', '{}')$$, '23514');
select tests.denied('idempotency key is unique per user',
  $$insert into public.orders (user_id, idempotency_key, subtotal_paise, shipping_paise, total_paise, phone, address_snapshot)
    values ('00000000-0000-0000-0000-00000000000a', 'k-a', 100, 0, 100, '9876543210', '{}')$$, '23505');
select tests.denied('invalid pincode rejected',
  $$insert into public.cod_pincodes (pincode) values ('012345')$$, '23514');

-- Anonymous
begin;
set local role anon;
select tests.eq('anon sees only published products', (select count(*) from public.products)::int, 8);
select tests.eq('anon cannot see draft product', (select count(*) from public.products where slug = 'draft-dress')::int, 0);
select tests.eq('anon sees published categories', (select count(*) from public.categories)::int, 4);
select tests.eq('anon cannot see draft variant stock', (select count(*) from public.inventory where variant_id = '20000000-0000-0000-0000-000000000001')::int, 0);
select tests.eq('anon sees active pincodes', (select count(*) from public.cod_pincodes)::int, 5);
select tests.denied('anon cannot read orders', 'select * from public.orders');
select tests.denied('anon cannot read addresses', 'select * from public.addresses');
select tests.denied('anon cannot read settings', 'select * from public.settings');
select tests.denied('anon cannot insert products', $$insert into public.products (category_id, slug, name, gst_rate_bps) select id, 'x', 'x', 0 from public.categories limit 1$$);
select tests.denied('anon cannot adjust stock', $$select public.admin_adjust_stock('20000000-0000-0000-0000-000000000001', 1, 'x')$$);
rollback;

-- Customer A
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
select tests.eq('customer sees own addresses only', (select count(*) from public.addresses)::int, 1);
select tests.eq('customer sees own orders only', (select count(*) from public.orders)::int, 1);
select tests.eq('customer cannot see another order', (select count(*) from public.orders where id = '30000000-0000-0000-0000-00000000000b')::int, 0);
select tests.eq('customer sees own payment only', (select count(*) from public.payments)::int, 1);
select tests.eq('customer cannot see draft product', (select count(*) from public.products where slug = 'draft-dress')::int, 0);
select tests.denied('customer cannot create an address for someone else',
  $$insert into public.addresses (user_id, full_name, phone, line1, city, state, pincode)
    values ('00000000-0000-0000-0000-00000000000b', 'X', '9876543212', 'l', 'c', 's', '600001')$$);
select tests.denied('customer cannot insert orders directly',
  $$insert into public.orders (user_id, idempotency_key, subtotal_paise, shipping_paise, total_paise, phone, address_snapshot)
    values ('00000000-0000-0000-0000-00000000000a', 'z', 1, 0, 1, '9876543210', '{}')$$);
select tests.denied('customer cannot update orders', $$update public.orders set status = 'delivered'$$);
select tests.denied('customer cannot write inventory', $$update public.inventory set available = 999$$);
do $$ declare n int; begin
  update public.products set name = 'x';
  get diagnostics n = row_count;
  perform tests.eq('customer update of products changes no rows', n, 0);
end $$;
select tests.denied('customer cannot grant themselves admin', $$insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-00000000000a')$$);
select tests.eq('customer sees no settings rows', (select count(*) from public.settings)::int, 0);
select tests.denied('customer cannot adjust stock', $$select public.admin_adjust_stock('20000000-0000-0000-0000-000000000001', 1, 'x')$$);
rollback;

-- Administrator
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000ad', true);
select tests.eq('admin sees draft product', (select count(*) from public.products where slug = 'draft-dress')::int, 1);
select tests.eq('admin sees all orders', (select count(*) from public.orders)::int, 2);
select tests.eq('admin reads settings', (select count(*) from public.settings)::int, 8);
select tests.eq('admin adjusts stock', public.admin_adjust_stock('20000000-0000-0000-0000-000000000001', 2, 'restock'), 5);
select tests.eq('adjustment is recorded', (select count(*) from public.inventory_adjustments)::int, 1);
select tests.denied('admin cannot take stock below zero', $$select public.admin_adjust_stock('20000000-0000-0000-0000-000000000001', -99, 'oops')$$, '23514');
select tests.denied('admin cannot edit orders directly (use transition functions)', $$update public.orders set status = 'confirmed'$$);
insert into public.categories (slug, name) values ('admin-made', 'Admin Made');
select tests.eq('admin can write catalog', (select count(*) from public.categories where slug = 'admin-made')::int, 1);
rollback;

select 'ALL DB TESTS PASSED' as result;
