drop policy if exists "skill_categories_insert_active_members" on public.skill_categories;
create policy "skill_categories_insert_uploader_or_admin"
on public.skill_categories
for insert
to authenticated
with check (
  public.is_active_org_member()
  and exists (
    select 1
    from public.skills
    where public.skills.id = skill_id
      and (public.skills.uploader_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "skill_categories_update_admin_only" on public.skill_categories;
create policy "skill_categories_update_uploader_or_admin"
on public.skill_categories
for update
to authenticated
using (
  public.is_active_org_member()
  and exists (
    select 1
    from public.skills
    where public.skills.id = skill_id
      and (public.skills.uploader_id = auth.uid() or public.is_admin())
  )
)
with check (
  public.is_active_org_member()
  and exists (
    select 1
    from public.skills
    where public.skills.id = skill_id
      and (public.skills.uploader_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists "skill_categories_delete_admin_only" on public.skill_categories;
create policy "skill_categories_delete_uploader_or_admin"
on public.skill_categories
for delete
to authenticated
using (
  public.is_active_org_member()
  and exists (
    select 1
    from public.skills
    where public.skills.id = skill_id
      and (public.skills.uploader_id = auth.uid() or public.is_admin())
  )
);
