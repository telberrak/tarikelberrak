-- Articles and labs can now be priced (USD, stored in cents) or free. Everything
-- that already exists stays free.
alter table articles add column price_cents integer not null default 0;
alter table articles add column is_free boolean not null default true;
alter table labs     add column price_cents integer not null default 0;
alter table labs     add column is_free boolean not null default true;

-- One row per (buyer, article|lab). Courses keep using `enrollments`.
create table content_purchases (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references users (id) on delete cascade,
    content_type text not null check (content_type in ('article', 'lab')),
    content_id uuid not null,
    stripe_payment_intent_id text,
    created_at timestamptz not null default now(),
    unique (user_id, content_type, content_id)
);
