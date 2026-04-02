create or replace function public.is_active_org_member(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_members
    where user_id = coalesce(check_user_id, auth.uid())
      and is_active = true
  );
$$;

create or replace function public.current_org_role(check_user_id uuid default auth.uid())
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.org_members
  where user_id = coalesce(check_user_id, auth.uid());
$$;

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_org_role(check_user_id) = 'admin';
$$;

grant execute on function public.is_active_org_member(uuid) to authenticated;
grant execute on function public.current_org_role(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to authenticated;

alter table public.org_members enable row level security;
alter table public.categories enable row level security;
alter table public.skills enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skill_versions enable row level security;
alter table public.downloads enable row level security;

drop policy if exists "org_members_select_self_or_admin" on public.org_members;
create policy "org_members_select_self_or_admin"
on public.org_members
for select
to authenticated
using (
  auth.uid() = user_id
  or (public.is_active_org_member() and is_active = true)
  or public.is_admin()
);

drop policy if exists "org_members_insert_self" on public.org_members;
create policy "org_members_insert_self"
on public.org_members
for insert
to authenticated
with check (
  auth.uid() = user_id
  and public.is_cars_email(email)
  and lower(email) = public.current_auth_email()
);

drop policy if exists "org_members_update_admin_only" on public.org_members;
create policy "org_members_update_admin_only"
on public.org_members
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "categories_select_active_members" on public.categories;
create policy "categories_select_active_members"
on public.categories
for select
to authenticated
using (public.is_active_org_member());

drop policy if exists "categories_write_admin_only" on public.categories;
create policy "categories_write_admin_only"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "skills_select_active_members" on public.skills;
create policy "skills_select_active_members"
on public.skills
for select
to authenticated
using (public.is_active_org_member());

drop policy if exists "skills_insert_active_members" on public.skills;
create policy "skills_insert_active_members"
on public.skills
for insert
to authenticated
with check (
  public.is_active_org_member()
  and uploader_id = auth.uid()
);

drop policy if exists "skills_update_uploader_or_admin" on public.skills;
create policy "skills_update_uploader_or_admin"
on public.skills
for update
to authenticated
using (
  public.is_active_org_member()
  and (uploader_id = auth.uid() or public.is_admin())
)
with check (
  public.is_active_org_member()
  and (uploader_id = auth.uid() or public.is_admin())
);

drop policy if exists "skills_delete_uploader_or_admin" on public.skills;
create policy "skills_delete_uploader_or_admin"
on public.skills
for delete
to authenticated
using (
  public.is_active_org_member()
  and (uploader_id = auth.uid() or public.is_admin())
);

drop policy if exists "skill_categories_select_active_members" on public.skill_categories;
create policy "skill_categories_select_active_members"
on public.skill_categories
for select
to authenticated
using (public.is_active_org_member());

drop policy if exists "skill_categories_insert_active_members" on public.skill_categories;
create policy "skill_categories_insert_active_members"
on public.skill_categories
for insert
to authenticated
with check (public.is_active_org_member());

drop policy if exists "skill_categories_update_admin_only" on public.skill_categories;
create policy "skill_categories_update_admin_only"
on public.skill_categories
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "skill_categories_delete_admin_only" on public.skill_categories;
create policy "skill_categories_delete_admin_only"
on public.skill_categories
for delete
to authenticated
using (public.is_admin());

drop policy if exists "skill_versions_select_active_members" on public.skill_versions;
create policy "skill_versions_select_active_members"
on public.skill_versions
for select
to authenticated
using (public.is_active_org_member());

drop policy if exists "skill_versions_insert_active_members" on public.skill_versions;
create policy "skill_versions_insert_active_members"
on public.skill_versions
for insert
to authenticated
with check (
  public.is_active_org_member()
  and created_by = auth.uid()
);

drop policy if exists "skill_versions_update_admin_only" on public.skill_versions;
create policy "skill_versions_update_admin_only"
on public.skill_versions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "downloads_select_self_or_admin" on public.downloads;
create policy "downloads_select_self_or_admin"
on public.downloads
for select
to authenticated
using (
  public.is_active_org_member()
);

drop policy if exists "downloads_insert_self" on public.downloads;
create policy "downloads_insert_self"
on public.downloads
for insert
to authenticated
with check (
  public.is_active_org_member()
  and user_id = auth.uid()
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('skills', 'skills', false, 5242880, array['text/markdown', 'text/plain'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "skills_bucket_select_active_members" on storage.objects;
create policy "skills_bucket_select_active_members"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'skills'
  and public.is_active_org_member()
);

drop policy if exists "skills_bucket_insert_owner_or_admin" on storage.objects;
create policy "skills_bucket_insert_owner_or_admin"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'skills'
  and public.is_active_org_member()
  and lower(name) like '%.md'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "skills_bucket_update_owner_or_admin" on storage.objects;
create policy "skills_bucket_update_owner_or_admin"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'skills'
  and public.is_active_org_member()
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'skills'
  and public.is_active_org_member()
  and lower(name) like '%.md'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "skills_bucket_delete_owner_or_admin" on storage.objects;
create policy "skills_bucket_delete_owner_or_admin"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'skills'
  and public.is_active_org_member()
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);
