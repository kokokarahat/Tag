"use client";

import { useEffect } from "react";

/**
 * Re-implements the source pages' small vanilla scripts:
 *
 * - account-type tabs (spec values swap)
 * - copy-trade tabs (image swap)
 * - deposit-method tabs (region panels)
 * - insurance certificate modal
 * - contact office switcher
 * - scroll reveals for the page-specific `.reveal` classes
 *
 * The captured markup is rendered verbatim, so everything is wired against the
 * same data attributes the original scripts used.
 */

const ACCOUNT_SPECS: Record<string, string[]> = {
  zero: ["$10 USD", "0.7 Pips", "$0", "1:500", "0.01", "100", "LDN"],
  pro: ["$10 USD", "1.0 Pips", "$0", "1:500", "0.01", "100", "LDN"],
  cent: ["$10 USD", "0.9 Pips", "$15", "1:500", "0.01", "100", "LDN"],
  islamic: ["$10 USD", "1.2 Pips", "$0", "1:500", "0.01", "100", "LDN"],
  amplify: ["$10 USD", "0.6 Pips", "$0", "1:500", "0.01", "100", "LDN"],
};

const OFFICES = [
  {
    name: "Global Marketing Office",
    address: "Dubai UAE",
    images: ["/assets/contact/image-1.jpg", "/assets/contact/image-2.jpg"],
  },
  {
    name: "LATAM Marketing Office",
    address: "Medellín, Colombia",
    images: ["/assets/contact/image-3.jpg", "/assets/contact/image-4.jpg"],
  },
  {
    name: "Business Address",
    address: "3 Emerald Park, Trianon, Quatres Bornes, Mauritius",
    images: [
      "/assets/contact/image-5.jpg",
      "/assets/contact/image-6.jpg",
      "/assets/contact/image-7.jpg",
    ],
  },
];

function tabKeyboard(
  tabList: Element | null,
  tabs: HTMLElement[],
  select: (tab: HTMLElement) => void,
) {
  tabList?.addEventListener("keydown", (event) => {
    const key = (event as KeyboardEvent).key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
    event.preventDefault();

    const current = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    const next =
      key === "Home"
        ? 0
        : key === "End"
          ? tabs.length - 1
          : (current + (key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;

    tabs[next]?.focus();
    if (tabs[next]) select(tabs[next]);
  });
}

function setupAccountTabs() {
  const root = document.querySelector("[data-account-types]");
  if (!root) return;

  const tabList = root.querySelector('[role="tablist"]');
  const panel = root.querySelector('[role="tabpanel"]');
  const tabs = Array.from(root.querySelectorAll<HTMLElement>("[data-account-tab]"));
  const values = Array.from(root.querySelectorAll<HTMLElement>("[data-spec-value]"));

  const select = (tab: HTMLElement) => {
    const id = tab.dataset.accountTab;
    if (!id || !ACCOUNT_SPECS[id]) return;

    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panel?.setAttribute("aria-labelledby", tab.id);
    panel?.classList.remove("is-changing");
    void (panel as HTMLElement | null)?.offsetWidth;
    values.forEach((value, index) => {
      value.textContent = ACCOUNT_SPECS[id][index];
    });
    panel?.classList.add("is-changing");
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => select(tab)));
  tabKeyboard(tabList, tabs, select);
}

function setupCopyTabs() {
  const root = document.querySelector("[data-copy-tabs]");
  if (!root) return;

  const tabList = root.querySelector('[role="tablist"]');
  const panel = root.querySelector('[role="tabpanel"]');
  const image = root.querySelector<HTMLImageElement>("[data-copy-tab-image]");
  const tabs = Array.from(root.querySelectorAll<HTMLElement>("[data-copy-tab]"));

  const select = (tab: HTMLElement) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panel?.setAttribute("aria-labelledby", tab.id);

    if (image && tab.dataset.src) {
      image.classList.remove("is-changing");
      void image.offsetWidth;
      image.src = tab.dataset.src;
      image.alt = tab.dataset.alt ?? "";
      image.classList.add("is-changing");
    }
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => select(tab)));
  tabKeyboard(tabList, tabs, select);
}

function setupDepositTabs() {
  const root = document.querySelector("[data-deposit-options]");
  if (!root) return;

  const tabList = root.querySelector('[role="tablist"]');
  const panel = root.querySelector('[role="tabpanel"]');
  const tabs = Array.from(root.querySelectorAll<HTMLElement>("[data-deposit-tab]"));
  const regions = Array.from(root.querySelectorAll<HTMLElement>("[data-regions]"));

  const select = (tab: HTMLElement) => {
    const id = tab.dataset.depositTab;
    if (!id) return;

    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });

    panel?.setAttribute("aria-labelledby", tab.id);
    regions.forEach((region) => {
      const match = region.dataset.regions?.split(" ").includes(id) ?? false;
      region.hidden = !match;
      if (match) {
        region.classList.remove("is-entering");
        void region.offsetWidth;
        region.classList.add("is-entering");
      }
    });
  };

  tabs.forEach((tab) => tab.addEventListener("click", () => select(tab)));
  tabKeyboard(tabList, tabs, select);
}

function setupInsuranceModal() {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("pdfFrame");
  const open = document.getElementById("openCert");
  const close = document.getElementById("closeCert");
  if (!modal || !(frame instanceof HTMLIFrameElement)) return;

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
  };

  open?.addEventListener("click", () => {
    frame.src = "/assets/insurance/certificate1_no_placed_with222.pdf#toolbar=0&navpanes=0";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });

  close?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function setupContactOffices() {
  const page = document.querySelector("[data-contact-page]");
  if (!page) return;

  const cards = Array.from(page.querySelectorAll<HTMLElement>("[data-office-card]"));
  const mainImage = page.querySelector<HTMLImageElement>("[data-office-main-image]");
  const thumbnails = page.querySelector<HTMLElement>("[data-office-thumbnails]");
  if (!cards.length || !mainImage || !thumbnails) return;

  const render = (officeIndex: number) => {
    const office = OFFICES[officeIndex];
    if (!office) return;

    mainImage.src = office.images[0];
    mainImage.alt = `${office.name} - Image 1`;
    thumbnails.innerHTML = "";

    office.images.forEach((src, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `office-thumbnail${index === 0 ? " is-active" : ""}`;
      button.dataset.officeThumb = "";
      button.dataset.image = src;
      button.dataset.alt = `${office.name} - Image ${index + 1}`;

      const img = document.createElement("img");
      img.src = src;
      img.alt = `${office.name} - Thumbnail ${index + 1}`;
      button.append(img);
      thumbnails.append(button);
    });
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const index = Number(card.dataset.officeIndex || 0);
      cards.forEach((item) => item.classList.toggle("is-active", item === card));
      render(index);
    });
  });

  thumbnails.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>("[data-office-thumb]");
    if (!button) return;

    mainImage.src = button.dataset.image ?? "";
    mainImage.alt = button.dataset.alt ?? "";
    thumbnails.querySelectorAll("[data-office-thumb]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
  });
}

function setupReveals() {
  const selectors = [
    "main > section:not(.legal-page)",
    "main .home-stats",
    "main .home-feature-card",
    "main .internal-card",
    "main .contact-form-grid",
    "main .contact-offices",
    "main .contact-whatsapp",
    "main .copy-reveal",
    "main .amplify-reveal",
    "main .education-reveal",
    "main .partners-reveal",
    "footer",
  ];

  const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors.join(",")));
  nodes.forEach((node) => node.classList.add("reveal-on-scroll"));

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
  );

  nodes.forEach((node) => observer.observe(node));
  return () => observer.disconnect();
}

export function InnerInteractions() {
  useEffect(() => {
    setupAccountTabs();
    setupCopyTabs();
    setupDepositTabs();
    setupInsuranceModal();
    setupContactOffices();
    const cleanupReveals = setupReveals();
    return () => cleanupReveals?.();
  }, []);

  return null;
}
