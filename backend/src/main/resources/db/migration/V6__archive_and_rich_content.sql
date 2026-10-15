-- Archiving: hidden from the public site and from the default admin list, restorable.
alter table articles add column archived boolean not null default false;
alter table labs     add column archived boolean not null default false;
alter table courses  add column archived boolean not null default false;

-- Existing article/lab bodies are Markdown; anything saved from the rich-text
-- editor is HTML. The format column tells the frontend how to render each row.
alter table articles add column content_format varchar(16) not null default 'markdown';
alter table labs     add column content_format varchar(16) not null default 'markdown';

-- Courses get a rich-text "about" body (HTML). `description` stays a short
-- plain-text summary for catalog cards.
alter table courses add column content text not null default '';
