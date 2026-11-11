import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { PortalShell } from "@/components/sites/tagmarkets/portal-app/PortalShell";
import pages from "@/content/portal/pages.json";
import shell from "@/content/portal/shell.json";
import { getDepositCoins } from "@/lib/deposit-wallets";

/** Captured portal routes, keyed by the path after `/dashboard`. */
const ROUTES: Record<string, keyof typeof pages> = {
  "": "home",
  "customer/my-profile": "my-profile",
  "customer/my-wallet": "my-wallet",
  "customer/trading-accounts": "trading-accounts",
  "customer/ib-area": "ib-my-clients",
  "customer/ib-area/my-campaigns": "ib-my-campaigns",
  "customer/ib-area/my-referral-links": "ib-my-referral-links",
  "customer/ib-area/my-clients": "ib-my-clients",
  "customer/ib-area/clients-activity": "ib-clients-activity",
  "customer/ib-area/my-payments": "ib-my-payments",
  "customer/ib-area/my-api": "ib-my-api",
  "customer/ib-area/my-reports": "ib-my-reports",
  "customer/support": "support",
  "customer/report-ondemand-non-ib": "report",
  "useful-info-tools/trading-platforms": "platforms",
  "useful-info-tools/trading-platforms/mt5-trader-pc": "mt5-pc",
  "useful-info-tools/trading-platforms/web-trader": "webtrader",
  "useful-info-tools/trading-platforms/mobile-android-trader": "mt5-android",
  "useful-info-tools/trading-platforms/mobile-ios-trader": "mt5-ios",
  "useful-info-tools/tools": "tools",
  "useful-info-tools/copy-trade": "copy-trade",
  "useful-info-tools/copy-trade/copytradesso": "copytradesso",
  "useful-info-tools/copy-trade/provider-ratings": "provider-ratings",
  "useful-info-tools/prop-trading": "prop-trading",
  "useful-info-tools/prop-trading/brokeree-sso": "brokeree",
  "useful-info-tools/web-custom-prop": "amplify",
  "useful-info-tools/web-educational-module": "academy",
  "useful-info-tools/web-copyx": "copyx",
};

type PortalProfile = {
  email: string;
  firstName: string;
  lastName: string;
};

function readProfile(cookieStore: Awaited<ReturnType<typeof cookies>>): PortalProfile | null {
  const raw = cookieStore.get("tm_portal_user")?.value;
  if (raw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<PortalProfile>;
      if (typeof parsed.email === "string" && parsed.email) {
        return {
          email: parsed.email,
          firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
          lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
        };
      }
    } catch {
      /* fall through to the legacy cookie */
    }
  }

  const legacy = cookieStore.get("tm_demo_user")?.value;
  if (!legacy) return null;
  try {
    return { email: decodeURIComponent(legacy), firstName: "", lastName: "" };
  } catch {
    return { email: legacy, firstName: "", lastName: "" };
  }
}

/** Stable, per-user hash so every registrant gets their own synthetic identifiers. */
function emailHash(email: string): number {
  let hash = 0;
  for (const char of email.toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

/** Synthetic customer number shown in the legacy chrome. */
function customerNumber(email: string): string {
  return `CU${100000 + (emailHash(email) % 900000)}`;
}

/** Synthetic MT5 login, generated per user (never copied from a real account). */
function mt5Login(email: string): string {
  return String(10000000 + ((emailHash(email) * 7) % 89999999));
}

/** Synthetic phone number, generated per user. */
function phoneNumber(email: string): string {
  return `00 1 555 ${String(100000 + ((emailHash(email) * 13) % 899999))}`;
}

export default async function DashboardCatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const key = (slug ?? []).join("/");
  const page = ROUTES[key];

  if (!page) notFound();

  const cookieStore = await cookies();
  const profile = readProfile(cookieStore);

  const fullName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || profile.email.split("@")[0]
    : "";
  const email = profile?.email ?? "";
  const customerId = profile ? customerNumber(profile.email) : "";

  const mt5 = profile ? mt5Login(profile.email) : "";
  const phone = profile ? phoneNumber(profile.email) : "";

  const resolved = (html: string) =>
    html
      .replaceAll("__TM_USER_NAME__", fullName || email)
      .replaceAll("__TM_USER_EMAIL__", email)
      .replaceAll("__TM_USER_CUSTOMER__", customerId)
      .replaceAll("__TM_USER_MT5__", mt5)
      .replaceAll("__TM_USER_PHONE__", phone);

  const combined = resolved(shell.header) + resolved(pages[page]) + resolved(shell.footer);
  const unclosedDivs = Math.max(
    0,
    (combined.match(/<div\b/g)?.length ?? 0) - (combined.match(/<\/div>/g)?.length ?? 0),
  );

  return (
    <PortalShell
      html={combined + "</div>".repeat(unclosedDivs)}
      coins={getDepositCoins()}
    />
  );
}
