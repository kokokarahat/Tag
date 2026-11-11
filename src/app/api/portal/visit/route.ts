import { classifyPage, recordVisit } from "@/lib/portal-store";

export const dynamic = "force-dynamic";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|phantom|puppeteer|playwright|curl|wget|python-requests|axios/i;

type VisitPayload = {
  path?: unknown;
  referredFrom?: unknown;
  visitorId?: unknown;
};

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return new Response(null, { status: 204 });
  }

  let payload: VisitPayload = {};
  try {
    payload = (await request.json()) as VisitPayload;
  } catch {
    return new Response(null, { status: 204 });
  }

  const path = typeof payload.path === "string" ? payload.path.slice(0, 512) : "";
  if (!path.startsWith("/")) return new Response(null, { status: 204 });

  const referrer =
    typeof payload.referredFrom === "string"
      ? payload.referredFrom
      : (request.headers.get("referer") ?? "");

  const visitorId = typeof payload.visitorId === "string" ? payload.visitorId : "";

  try {
    await recordVisit(request, {
      path,
      page: classifyPage(path),
      referrer,
      visitorId,
    });
  } catch (error) {
    // Analytics must never break the portal itself.
    console.error("visit tracking failed", error);
  }

  return new Response(null, { status: 204 });
}
