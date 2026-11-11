import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PortalProfileProvider } from "@/components/sites/tagmarkets/portal-app/PortalProfileContext";

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

/** Stable, non-identifying customer number shown in the legacy chrome. */
function customerNumber(email: string): string {
  let hash = 0;
  for (const char of email.toLowerCase()) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return `CU${100000 + (hash % 900000)}`;
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const profile = readProfile(cookieStore);

  if (!profile) redirect("/login");

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
  const name = fullName || profile.email.split("@")[0];

  return (
    <PortalProfileProvider name={name} email={profile.email} customerId={customerNumber(profile.email)}>
      {children}
    </PortalProfileProvider>
  );
}
