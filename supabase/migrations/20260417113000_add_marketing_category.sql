insert into public.categories (slug, name)
values ('marketing', 'Marketing')
on conflict (slug) do update
set name = excluded.name;
