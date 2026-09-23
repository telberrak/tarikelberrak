alter table users add column is_admin boolean not null default false;

create table articles (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    excerpt text not null default '',
    content text not null default '',
    article_date date not null default current_date,
    read_minutes integer not null default 5,
    tags text not null default '',
    author text not null default '',
    icon text not null default 'bars' check (icon in ('bars', 'network', 'hexagons', 'toggle', 'rings', 'wave')),
    published boolean not null default true,
    created_at timestamptz not null default now()
);

create table labs (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    excerpt text not null default '',
    content text not null default '',
    status text not null default 'In Progress' check (status in ('Live', 'In Progress', 'Case Study', 'Prototype')),
    category text not null default 'AI & LLM' check (category in ('AI & LLM', 'Cloud & Kubernetes', 'Trading & Quant', 'Event-Driven')),
    tags text not null default '',
    icon text not null default 'bars' check (icon in ('bars', 'network', 'hexagons', 'toggle', 'rings', 'wave')),
    lab_date date not null default current_date,
    published boolean not null default true,
    created_at timestamptz not null default now()
);
