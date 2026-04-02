create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_auth_email()
returns text
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

create or replace function public.is_cars_email(candidate text)
returns boolean
language sql
immutable
as $$
  select lower(coalesce(candidate, '')) like '%@cars24.com';
$$;

create table if not exists public.org_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'member' check (role in ('member', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text,
  long_description text,
  uploader_id uuid not null references public.org_members(user_id) on delete restrict,
  file_path text not null,
  current_version numeric not null default 1 check (current_version > 0),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_categories (
  skill_id uuid not null references public.skills(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (skill_id, category_id)
);

create table if not exists public.skill_versions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  version_number numeric not null check (version_number > 0),
  storage_path text not null,
  change_notes text,
  created_at timestamptz not null default now(),
  created_by uuid not null references public.org_members(user_id) on delete restrict,
  unique (skill_id, version_number)
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  user_id uuid not null references public.org_members(user_id) on delete restrict,
  downloaded_at timestamptz not null default now()
);

drop trigger if exists set_skills_updated_at on public.skills;

create trigger set_skills_updated_at
before update on public.skills
for each row
execute function public.set_updated_at();
