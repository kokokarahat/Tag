"use client";

import { useEffect } from "react";

const VISITOR_KEY = "tm_visitor_id";

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

/**
 * Fire-and-forget page-view beacon used by the admin traffic stats.
 *
 * Only one hit per page per browser session, and failures are swallowed so a
 * blocked request can never affect the portal itself.
 */
export function VisitTracker({ page }: { page: string }) {
  useEffect(() => {
    const storageKey = `tm_visit_${page}`;

    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      /* storage blocked: still count the hit once per mount */
    }

    const body = JSON.stringify({
      path: window.location.pathname,
      referredFrom: document.referrer,
      visitorId: readVisitorId(),
    });

    void fetch("/api/portal/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  }, [page]);

  return null;
}
