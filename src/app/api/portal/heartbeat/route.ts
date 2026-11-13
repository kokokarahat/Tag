import { classifyPage, touchPresence } from "@/lib/portal-store";

export const dynamic = "force-dynamic";

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|phantom|puppeteer|playwright|curl|wget|python-requests|axios/i;

type HeartbeatPayload = {
  path?: unknown;
  visitorId?: unknown;
  referredFrom?: unknown;
};

export async function POST(request: Request) {
  const userAgent = request.headers.get("user-agent") ?? "";
  if (!userAgent || BOT_PATTERN.test(userAgent)) {
    return new Response(null, { status: 204 });
  }

  let payload: HeartbeatPayload = {};
  try {
    payload = (await request.json()) as HeartbeatPayload;
  } catch {
    return new Response(null, { status: 204 });
  }

  const visitorId = typeof payload.visitorId === "string" ? payload.visitorId : "";
  const path = typeof payload.path === "string" ? payload.path : "";
  if (!visitorId || !path.startsWith("/")) {
    return new Response(null, { status: 204 });
  }

  const referrer =
    typeof payload.referredFrom === "string"
      ? payload.referredFrom
      : (request.headers.get("referer") ?? "");

  try {
    await touchPresence(request, {
      visitorId,
      path,
      page: classifyPage(path),
      referrer,
    });
  } catch (error) {
    // Presence is best-effort and must never affect the page.
    console.error("presence heartbeat failed", error);
  }

  return new Response(null, { status: 204 });
}
