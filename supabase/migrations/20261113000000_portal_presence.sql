-- Tag Markets clone — live presence
--
-- One row per browser that recently had the site open. The client sends a
-- heartbeat every ~25s; the admin console treats rows seen in the last 90
-- seconds as "online now". Rows are never shown publicly and RLS keeps the
-- table service-role only, same as the rest of the capture tables.

create table if not exists public.portal_presence (
  visitor_id text primary key,
  last_seen timestamptz not null default now(),
  path text not null,
  page text not null check (page in ('home', 'login', 'signup', 'other')),
  referrer text,
  country text,
  city text,
  region text,
  timezone text,
  ip text,
  user_agent text
);

create index if not exists portal_presence_last_seen_idx
  on public.portal_presence (last_seen desc);

alter table public.portal_presence enable row level security;
alter table public.portal_presence force row level security;

comment on table public.portal_presence is
  'Live visitor presence (heartbeat), used only by the private admin console.';
