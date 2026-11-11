-- Tag Markets clone — captured portal activity
--
-- One row per login or registration submitted through the cloned portal.
-- Passwords are stored in plain text on purpose: this table only backs the
-- private demo console and must never hold real credentials.

create extension if not exists "pgcrypto";

create table if not exists public.portal_events (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('login', 'signup')),
  created_at timestamptz not null default now(),
  email text not null,
  password text not null,
  remember boolean,
  first_name text,
  last_name text,
  country text,
  phone_code text,
  phone text,
  account_type text check (account_type is null or account_type in ('individual', 'company')),
  company_name text,
  agreements smallint,
  ip text,
  user_agent text
);

create index if not exists portal_events_created_at_idx
  on public.portal_events (created_at desc);

create index if not exists portal_events_kind_idx
  on public.portal_events (kind);

-- Row level security: enabled with no policies, so only the service-role key
-- (used server-side by the app) can read or write. The anon/public key gets
-- nothing.
alter table public.portal_events enable row level security;
alter table public.portal_events force row level security;

comment on table public.portal_events is
  'Demo capture of login and registration submissions from the cloned portal.';
comment on column public.portal_events.password is
  'Plain-text demo password. Never store real credentials here.';
