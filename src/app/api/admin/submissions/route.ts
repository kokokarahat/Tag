import { isValidAdminCookie } from "@/lib/admin-auth";
import { clearEvents, listEvents } from "@/lib/portal-store";

export const dynamic = "force-dynamic";

function unauthorized() {
  return Response.json(
    { ok: false, error: "unauthorized" },
    { status: 401, headers: { "Cache-Control": "no-store" } },
  );
}

function isAuthorized(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)tm_admin=([^;]+)/);
  return isValidAdminCookie(match?.[1]);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  const events = await listEvents();
  return Response.json(
    { ok: true, events },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  const removed = await clearEvents();
  return Response.json({ ok: true, removed });
}
