create table if not exists public.skill_change_events (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  version_number numeric not null check (version_number > 0),
  change_summary text not null,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.org_members(user_id) on delete restrict
);

create index if not exists skill_change_events_skill_id_created_at_idx
on public.skill_change_events (skill_id, created_at desc);

insert into public.skill_change_events (
  skill_id,
  version_number,
  change_summary,
  created_at,
  created_by
)
select
  skill_id,
  version_number,
  coalesce(nullif(trim(change_notes), ''), 'Saved the latest version.'),
  created_at,
  created_by
from public.skill_versions version_row
where not exists (
  select 1
  from public.skill_change_events change_event
  where change_event.skill_id = version_row.skill_id
    and change_event.version_number = version_row.version_number
    and change_event.created_at = version_row.created_at
    and change_event.created_by = version_row.created_by
    and change_event.change_summary = coalesce(nullif(trim(version_row.change_notes), ''), 'Saved the latest version.')
);

alter table public.skill_change_events enable row level security;

drop policy if exists "skill_change_events_select_active_members" on public.skill_change_events;
create policy "skill_change_events_select_active_members"
on public.skill_change_events
for select
to authenticated
using (public.is_active_org_member());

drop policy if exists "skill_change_events_insert_active_members" on public.skill_change_events;
create policy "skill_change_events_insert_active_members"
on public.skill_change_events
for insert
to authenticated
with check (
  public.is_active_org_member()
  and created_by = auth.uid()
);

drop policy if exists "skill_change_events_delete_creator_or_admin" on public.skill_change_events;
create policy "skill_change_events_delete_creator_or_admin"
on public.skill_change_events
for delete
to authenticated
using (
  public.is_active_org_member()
  and (created_by = auth.uid() or public.is_admin())
);
