"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { DepositModal } from "./DepositModal";
import type { DepositCoin } from "@/lib/deposit-wallets";

type PortalShellProps = {
  /** Already-resolved (server-side) header + page + footer markup, user tokens substituted. */
  html: string;
  coins: DepositCoin[];
};

/** Shows each sidebar sub-menu whose parent row is open (the legacy jQuery did this with slideDown). */
function syncSubMenus(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".page-sidebar-menu li > ul.sub-menu").forEach((sub) => {
    const isOpen = sub.parentElement?.classList.contains("open") ?? false;
    sub.style.display = isOpen ? "block" : "none";
  });
}

/** Maps the live URL scheme (`/en/...`, `/en/home`) onto the local route keys. */
function normalizePath(path: string): string {
  const stripped = path.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "");
  return stripped === "" || stripped === "/home" ? "/dashboard" : stripped;
}

/**
 * Legacy portal chrome: fixed header, sidebar menu, page body and footer.
 *
 * The fragments are concatenated by the server before injection so the legacy
 * `.page-content` / `.page-container` wrappers close in the right order. All
 * interactions are delegated from the container because the markup is captured
 * HTML rather than React nodes.
 */
export function PortalShell({ html, coins }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const signOut = useCallback(async () => {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  // Mark the sidebar entry that matches the current route. The current leaf gets
  // `active`; its parent section only gets `open` (the live site does the same).
  useEffect(() => {
    if (!root) return;
    const current = normalizePath(pathname);
    const links = root.querySelectorAll<HTMLAnchorElement>(".page-sidebar-menu a[href]");
    links.forEach((link) => {
      const li = link.closest("li");
      if (!li) return;
      li.classList.remove("active", "open", "menu-selected");
      const href = normalizePath(link.getAttribute("href") ?? "");
      const matches = href === current || (href !== "/dashboard" && current.startsWith(`${href}/`));
      if (!matches) return;
      li.classList.add("active", "menu-selected");
      li.parentElement?.closest("li")?.classList.add("open");
    });
    syncSubMenus(root);
  }, [root, pathname, html]);

  // Delegated legacy interactions (menus, dropdowns, tabs, deposit, logout).
  useEffect(() => {
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const logout = target.closest<HTMLAnchorElement>('a[href="/auth?logout=1&brd=1"], [href*="logout=1"]');
      if (logout) {
        event.preventDefault();
        void signOut();
        return;
      }

      const reveal = target.closest<HTMLElement>(".amount-reveal");
      if (reveal) {
        const list = reveal.closest(".balance-list");
        const hidden = reveal.classList.toggle("fa-eye");
        reveal.classList.toggle("fa-eye-slash", !hidden);
        list?.querySelectorAll<HTMLElement>(".customer-balance-amount-head").forEach((el) => {
          el.style.display = hidden ? "none" : "";
        });
        list?.querySelectorAll<HTMLElement>(".customer-balance-amount-head-stars").forEach((el) => {
          el.style.display = hidden ? "" : "none";
        });
        return;
      }

      if (target.closest(".menu-toggler.sidebar-toggler")) {
        document.body.classList.toggle("page-sidebar-closed");
        return;
      }

      const responsive = target.closest<HTMLElement>(".menu-toggler.responsive-toggler");
      if (responsive) {
        root.querySelector<HTMLElement>(".page-sidebar.navbar-collapse")?.classList.toggle("in");
        responsive.classList.toggle("active");
        return;
      }

      const navToggle = target.closest<HTMLAnchorElement>("a.nav-toggle");
      if (navToggle) {
        const li = navToggle.closest("li");
        if (li?.querySelector(":scope > ul.sub-menu")) {
          event.preventDefault();
          li.classList.toggle("open");
          syncSubMenus(root);
        }
        return;
      }

      const dropdown = target.closest<HTMLAnchorElement>(".dropdown-toggle");
      if (dropdown) {
        const li = dropdown.closest("li");
        if (li) {
          event.preventDefault();
          const isOpen = li.classList.contains("open");
          root.querySelectorAll(".top-menu li.open").forEach((el) => el.classList.remove("open"));
          li.classList.toggle("open", !isOpen);
        }
        return;
      }

      // Bootstrap-style collapse (account accordions, FAQ blocks, ...).
      const collapse = target.closest<HTMLElement>("[data-toggle='collapse']");
      if (collapse) {
        event.preventDefault();
        const selector = collapse.getAttribute("href") ?? collapse.getAttribute("data-target");
        const panel = selector ? root.querySelector<HTMLElement>(selector) : null;
        if (!panel) return;
        const isOpen = panel.classList.contains("in");
        panel.classList.toggle("in", !isOpen);
        collapse.classList.toggle("collapsed", isOpen);
        collapse.setAttribute("aria-expanded", String(!isOpen));
        return;
      }

      // Bootstrap-style tabs.
      const tab = target.closest<HTMLElement>("[data-toggle='tab'], [data-toggle='pill']");
      if (tab) {
        event.preventDefault();
        const selector = tab.getAttribute("href") ?? tab.getAttribute("data-target");
        const pane = selector ? root.querySelector<HTMLElement>(selector) : null;
        if (!pane) return;
        pane.parentElement?.querySelectorAll<HTMLElement>(".tab-pane").forEach((el) => {
          el.classList.remove("active", "in");
        });
        pane.classList.add("active", "in");
        tab.closest("ul")?.querySelectorAll<HTMLElement>(".tab-pane").forEach((el) => {
          el.classList.remove("active");
        });
        tab.closest("li")?.classList.add("active");
        return;
      }

      if (target.closest(".scroll-to-top")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".top-menu li.dropdown") || target.closest(".page-sidebar-menu")) return;
      root.querySelectorAll(".top-menu li.open").forEach((el) => el.classList.remove("open"));
    };

    const onSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName !== "FORM") return;
      event.preventDefault();
    };

    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);
    document.addEventListener("click", onDocumentClick);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("submit", onSubmit);
      document.removeEventListener("click", onDocumentClick);
    };
  }, [root, html, signOut]);

  return (
    <>
      <div ref={setRoot} className="tm-portal-root" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
      {depositOpen && (
        <div className="modal-backdrop fade in" style={{ opacity: 0.9, zIndex: 9999 }} />
      )}
      {depositOpen && <DepositModal open onClose={() => setDepositOpen(false)} coins={coins} />}
      <DepositTrigger onOpen={() => setDepositOpen(true)} />
    </>
  );
}

/** Deposit buttons live inside the injected HTML, so the trigger is delegated. */
function DepositTrigger({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const button = target.closest<HTMLElement>(
        ".btn-deposit-header, .btn-deposit, #btn-balances-my-wallet-deposit, .btn-deposit-modal",
      );
      if (!button) return;
      event.preventDefault();
      onOpen();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [onOpen]);

  return null;
}
