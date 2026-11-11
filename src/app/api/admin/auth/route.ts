import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  adminCookieValue,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let password = "";
  try {
    const payload = (await request.json()) as { password?: unknown };
    password = typeof payload.password === "string" ? payload.password : "";
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!password || !isValidAdminPassword(password)) {
    return Response.json({ ok: false, error: "invalid-password" }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${adminCookieValue()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
      ADMIN_COOKIE_OPTIONS.maxAge
    }`,
  );
  return response;
}

export async function DELETE() {
  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
  return response;
}
