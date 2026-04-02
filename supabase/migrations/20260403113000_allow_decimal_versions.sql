alter table public.skills
alter column current_version type numeric using current_version::numeric;

alter table public.skills
alter column current_version set default 1;

alter table public.skills
drop constraint if exists skills_current_version_check;

alter table public.skills
add constraint skills_current_version_check check (current_version > 0);

alter table public.skill_versions
alter column version_number type numeric using version_number::numeric;

alter table public.skill_versions
drop constraint if exists skill_versions_version_number_check;

alter table public.skill_versions
add constraint skill_versions_version_number_check check (version_number > 0);
