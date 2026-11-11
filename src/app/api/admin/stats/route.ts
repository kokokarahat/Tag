import { isValidAdminCookie } from "@/lib/admin-auth";
import { getPortalStats } from "@/lib/portal-stats";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)tm_admin=([^;]+)/);
  return isValidAdminCookie(match?.[1]);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const stats = await getPortalStats();
    return Response.json(
      { ok: true, stats },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("stats failed", error);
    return Response.json(
      { ok: false, error: "stats-failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
