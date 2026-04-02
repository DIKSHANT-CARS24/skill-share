insert into public.categories (slug, name)
values
  ('design', 'Design'),
  ('development', 'Development'),
  ('product', 'Product'),
  ('finance', 'Finance'),
  ('operations', 'Operations')
on conflict (slug) do update
set name = excluded.name;
