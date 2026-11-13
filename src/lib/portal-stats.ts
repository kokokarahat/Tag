import { listEvents, listPresence, listVisits } from "@/lib/portal-store";
import type {
  CountryStat,
  DailyStat,
  PageStat,
  PortalEvent,
  PortalStats,
  PortalVisit,
  VisitPage,
} from "@/types/portal";

const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_WINDOW = 14;

function startOfUtcDay(value: number): number {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function dayKey(value: number): string {
  return new Date(value).toISOString().slice(0, 10);
}

function visitorKey(visit: PortalVisit): string {
  if (visit.visitorId) return `v:${visit.visitorId}`;
  if (visit.ip) return `ip:${visit.ip}`;
  return `id:${visit.id}`;
}

function eventCountry(event: PortalEvent): string {
  return (event.geoCountry ?? "").toUpperCase();
}

/**
 * Aggregates visits and captured submissions for the admin console.
 *
 * Everything is computed in one pass over the newest 5k rows, which is plenty
 * for a demo portal and keeps the Supabase queries to two simple selects.
 */
export async function getPortalStats(): Promise<PortalStats> {
  const now = Date.now();
  const onlineSince = new Date(now - 90_000).toISOString();
  const [events, visits, live] = await Promise.all([
    listEvents(),
    listVisits(),
    listPresence(onlineSince),
  ]);

  const todayStart = startOfUtcDay(now);
  const weekStart = todayStart - 6 * DAY_MS;

  const totals = {
    visits: visits.length,
    visitsToday: 0,
    visitsWeek: 0,
    uniqueVisitors: 0,
    logins: events.filter((event) => event.kind === "login").length,
    signups: events.filter((event) => event.kind === "signup").length,
  };

  const visitors = new Set<string>();
  const countries = new Map<string, CountryStat>();
  const pages = new Map<VisitPage, { visits: number; visitors: Set<string> }>();
  const daily = new Map<string, DailyStat>();

  for (let index = 0; index < DAILY_WINDOW; index += 1) {
    const key = dayKey(todayStart - (DAILY_WINDOW - 1 - index) * DAY_MS);
    daily.set(key, { date: key, visits: 0, logins: 0, signups: 0 });
  }

  const countryEntry = (code: string): CountryStat => {
    const key = code || "unknown";
    const existing = countries.get(key);
    if (existing) return existing;
    const created: CountryStat = { country: key, visits: 0, logins: 0, signups: 0, visitors: 0 };
    countries.set(key, created);
    return created;
  };

  for (const visit of visits) {
    const at = new Date(visit.at).getTime();
    if (Number.isFinite(at)) {
      if (at >= todayStart) totals.visitsToday += 1;
      if (at >= weekStart) totals.visitsWeek += 1;
      const bucket = daily.get(dayKey(at));
      if (bucket) bucket.visits += 1;
    }

    const key = visitorKey(visit);
    if (!visitors.has(key)) {
      visitors.add(key);
      countryEntry(visit.country || "").visitors += 1;
    }

    const page = pages.get(visit.page) ?? { visits: 0, visitors: new Set<string>() };
    page.visits += 1;
    page.visitors.add(key);
    pages.set(visit.page, page);

    countryEntry(visit.country || "").visits += 1;
  }

  totals.uniqueVisitors = visitors.size;

  for (const event of events) {
    const at = new Date(event.at).getTime();
    if (Number.isFinite(at)) {
      const bucket = daily.get(dayKey(at));
      if (bucket) {
        if (event.kind === "login") bucket.logins += 1;
        else bucket.signups += 1;
      }
    }

    const entry = countryEntry(eventCountry(event));
    if (event.kind === "login") entry.logins += 1;
    else entry.signups += 1;
  }

  const byCountry = [...countries.values()]
    .sort((a, b) => b.visits + b.logins + b.signups - (a.visits + a.logins + a.signups))
    .slice(0, 12);

  const byPage: PageStat[] = [...pages.entries()]
    .map(([page, value]) => ({ page, visits: value.visits, visitors: value.visitors.size }))
    .sort((a, b) => b.visits - a.visits);

  return {
    generatedAt: new Date().toISOString(),
    totals,
    live,
    byCountry,
    byPage,
    daily: [...daily.values()],
    recentVisits: visits.slice(0, 25),
  };
}
