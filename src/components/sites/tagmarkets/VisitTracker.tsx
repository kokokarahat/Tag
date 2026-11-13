"use client";

import { useEffect } from "react";

const VISITOR_KEY = "tm_visitor_id";
const HEARTBEAT_MS = 25_000;
const MAX_TRACKING_MS = 2 * 60 * 60 * 1000;

function readVisitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    return "";
  }
}

function send(url: string, body: string) {
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

/**
 * Fire-and-forget page-view beacon + live presence heartbeat.
 *
 * One view per page per browser session, then a heartbeat every 25s so the
 * admin console can show who is on the site right now. Heartbeats stop after
 * two hours to avoid a forgotten tab pinging forever, and every failure is
 * swallowed so tracking can never affect the portal itself.
 */
export function VisitTracker({ page }: { page: string }) {
  useEffect(() => {
    const visitorId = readVisitorId();
    const startedAt = Date.now();
    const payload = () =>
      JSON.stringify({
        path: window.location.pathname,
        referredFrom: document.referrer,
        visitorId,
      });

    let counted = false;
    try {
      counted = window.sessionStorage.getItem(`tm_visit_${page}`) === "1";
      window.sessionStorage.setItem(`tm_visit_${page}`, "1");
    } catch {
      /* storage blocked: still count once per mount */
    }

    if (!counted) {
      void send("/api/portal/visit", payload());
    }

    if (!visitorId) return;

    const beat = () => {
      if (Date.now() - startedAt > MAX_TRACKING_MS) return;
      if (document.visibilityState === "hidden") return;
      void send("/api/portal/heartbeat", payload());
    };

    beat();
    const timer = window.setInterval(beat, HEARTBEAT_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [page]);

  return null;
}
