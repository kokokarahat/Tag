"use client";

import { useEffect } from "react";

/**
 * Publishes the fixed jurisdiction bar height as `--mobile-jurisdiction-height`
 * so the page can reserve exactly that much space at the bottom.
 * Mirrors the source site's ResizeObserver script.
 */
export function JurisdictionHeight() {
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const notice = document.querySelector<HTMLElement>("[data-jurisdiction-notice]");
    const root = document.documentElement;
    let last = -1;

    const apply = () => {
      const height = media.matches && notice ? Math.ceil(notice.getBoundingClientRect().height) : 0;
      if (height !== last) {
        last = height;
        root.style.setProperty("--mobile-jurisdiction-height", `${height}px`);
      }
    };

    const observer = notice ? new ResizeObserver(apply) : null;
    observer?.observe(notice as HTMLElement);
    media.addEventListener("change", apply);
    void document.fonts.ready.then(apply);
    apply();

    return () => {
      observer?.disconnect();
      media.removeEventListener("change", apply);
    };
  }, []);

  return null;
}
