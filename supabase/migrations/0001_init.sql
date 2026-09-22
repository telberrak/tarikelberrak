-- Personal portfolio / course platform schema
-- Run via the Supabase CLI: supabase db push
-- or paste into the SQL editor of your Supabase project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Member',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- courses / course_sections / lessons / lesson_assets
-- ---------------------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  level text not null default 'beginner' check (level in ('beginner', 'intermediate', 'advanced')),
  category text not null default 'general',
  price_cents integer not null default 0,
  is_free boolean not null default false,
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "published courses are publicly readable"
  on public.courses for select
  using (published = true);

create table if not exists public.course_sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position integer not null default 0
);

alter table public.course_sections enable row level security;

create policy "sections of published courses are publicly readable"
  on public.course_sections for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_sections.course_id and c.published = true
    )
  );

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  section_id uuid references public.course_sections (id) on delete set null,
  slug text not null,
  title text not null,
  position integer not null default 0,
  duration_seconds integer not null default 0,
  is_preview boolean not null default false,
  notes text default '',
  unique (course_id, slug)
);

alter table public.lessons enable row level security;

create policy "lessons of published courses are publicly readable"
  on public.lessons for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = lessons.course_id and c.published = true
    )
  );

-- Video location lives in its own table so RLS can hide it from anyone
-- who hasn't purchased the course (and isn't looking at a free preview).
create table if not exists public.lesson_assets (
  lesson_id uuid primary key references public.lessons (id) on delete cascade,
  provider text not null default 'html5' check (provider in ('html5', 'mux')),
  video_asset_id text not null
);

alter table public.lesson_assets enable row level security;

create policy "lesson assets are readable when unlocked"
  on public.lesson_assets for select
  using (
    exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = lesson_assets.lesson_id
        and c.published = true
        and (
          l.is_preview = true
          or exists (
            select 1 from public.enrollments e
            where e.course_id = l.course_id and e.user_id = auth.uid()
          )
        )
    )
  );

-- ---------------------------------------------------------------------------
-- enrollments
-- ---------------------------------------------------------------------------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  source text not null check (source in ('free', 'stripe')),
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "users can read their own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

-- No insert/update/delete policy: all writes happen server-side with the
-- service role key (free enrollment server action, Stripe webhook).

-- ---------------------------------------------------------------------------
-- lesson_progress
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  watched_seconds integer not null default 0,
  duration_seconds integer not null default 0,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "users can read their own progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

-- No insert/update policy: progress is upserted server-side (service role)
-- after verifying the caller's session, so client can't fabricate progress.

-- ---------------------------------------------------------------------------
-- comments
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  target_type text not null check (target_type in ('article', 'lab', 'course', 'lesson')),
  target_slug text not null,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden')),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "visible comments are publicly readable"
  on public.comments for select
  using (status = 'visible' or auth.uid() = user_id);

-- No insert policy: comments are created via a server action that checks
-- the caller is signed in, then writes with the service role key.

create index if not exists comments_target_idx on public.comments (target_type, target_slug);

-- ---------------------------------------------------------------------------
-- contact_submissions
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- No client policies at all: written and read only via the service role
-- (contact form server action / future admin inbox).
