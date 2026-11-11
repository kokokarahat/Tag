-- Tag Markets clone — visit analytics for the cloned portal
--
-- One row per page view of a tracked marketing/portal page. Used by the admin
-- console to answer "are people actually landing on /login and /register?".
-- No personal data beyond what the request already exposes (IP, UA, referrer)
-- plus a random per-browser visitor id that is never linked to an identity.

create extension if not exists "pgcrypto";

create table if not exists public.portal_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  page text not null check (page in ('home', 'login', 'signup', 'other')),
  referrer text,
  country text,
  city text,
  region text,
  timezone text,
  ip text,
  user_agent text,
  visitor_id text
);

create index if not exists portal_visits_created_at_idx
  on public.portal_visits (created_at desc);

create index if not exists portal_visits_page_idx
  on public.portal_visits (page);

create index if not exists portal_visits_country_idx
  on public.portal_visits (country);

create index if not exists portal_visits_visitor_idx
  on public.portal_visits (visitor_id);

-- Same posture as portal_events: RLS on, no policies, so only the server-side
-- service-role key can read or write.
alter table public.portal_visits enable row level security;
alter table public.portal_visits force row level security;

comment on table public.portal_visits is
  'Page views on tracked clone pages, used for the private admin analytics.';

-- Geo columns on the existing submission table so the console can show where
-- logins and registrations came from, not just page views.
alter table public.portal_events add column if not exists geo_country text;
alter table public.portal_events add column if not exists geo_city text;
alter table public.portal_events add column if not exists geo_region text;
