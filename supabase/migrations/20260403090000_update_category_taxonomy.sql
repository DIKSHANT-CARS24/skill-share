begin;

insert into public.categories (slug, name)
values
  ('design', 'Design'),
  ('development', 'Development'),
  ('product', 'Product'),
  ('finance', 'Finance'),
  ('operations', 'Operations'),
  ('marketing', 'Marketing')
on conflict (slug) do update
set name = excluded.name;

with retired_to_canonical(old_slug, new_slug) as (
  values
    ('engineering', 'development'),
    ('customer-support', 'operations'),
    ('people-ops', 'product'),
    ('people', 'product')
),
retired_categories as (
  select categories.id as old_id, retired_to_canonical.new_slug
  from public.categories as categories
  join retired_to_canonical on retired_to_canonical.old_slug = categories.slug
),
canonical_categories as (
  select retired_categories.old_id, categories.id as new_id
  from retired_categories
  join public.categories as categories on categories.slug = retired_categories.new_slug
)
insert into public.skill_categories (skill_id, category_id)
select distinct skill_categories.skill_id, canonical_categories.new_id
from public.skill_categories
join canonical_categories on canonical_categories.old_id = skill_categories.category_id
on conflict do nothing;

delete from public.skill_categories
using public.categories
where public.skill_categories.category_id = public.categories.id
  and public.categories.slug in ('engineering', 'customer-support', 'people-ops', 'people');

delete from public.categories
where slug not in ('design', 'development', 'product', 'finance', 'operations', 'marketing');

commit;
