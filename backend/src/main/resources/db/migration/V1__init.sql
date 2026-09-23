create extension if not exists "pgcrypto";

create table users (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password_hash text not null,
    display_name text not null default 'Member',
    avatar_url text,
    stripe_customer_id text,
    created_at timestamptz not null default now()
);

create table password_reset_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    token text not null unique,
    expires_at timestamptz not null,
    used boolean not null default false,
    created_at timestamptz not null default now()
);

create table courses (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
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

create table course_sections (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references courses (id) on delete cascade,
    title text not null,
    position integer not null default 0
);

create table lessons (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references courses (id) on delete cascade,
    section_id uuid references course_sections (id) on delete set null,
    slug text not null,
    title text not null,
    position integer not null default 0,
    duration_seconds integer not null default 0,
    is_preview boolean not null default false,
    notes text default '',
    unique (course_id, slug)
);

create table lesson_assets (
    lesson_id uuid primary key references lessons (id) on delete cascade,
    provider text not null default 'html5' check (provider in ('html5', 'mux')),
    video_asset_id text not null
);

create table enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    course_id uuid not null references courses (id) on delete cascade,
    source text not null check (source in ('free', 'stripe')),
    stripe_payment_intent_id text,
    created_at timestamptz not null default now(),
    unique (user_id, course_id)
);

create table lesson_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    lesson_id uuid not null references lessons (id) on delete cascade,
    watched_seconds integer not null default 0,
    duration_seconds integer not null default 0,
    completed boolean not null default false,
    completed_at timestamptz,
    updated_at timestamptz not null default now(),
    unique (user_id, lesson_id)
);

create table comments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    target_type text not null check (target_type in ('article', 'lab', 'course', 'lesson')),
    target_slug text not null,
    parent_id uuid references comments (id) on delete cascade,
    body text not null,
    status text not null default 'visible' check (status in ('visible', 'hidden')),
    created_at timestamptz not null default now()
);

create index comments_target_idx on comments (target_type, target_slug);

create table contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    message text not null,
    status text not null default 'new' check (status in ('new', 'read', 'archived')),
    created_at timestamptz not null default now()
);
