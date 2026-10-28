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
