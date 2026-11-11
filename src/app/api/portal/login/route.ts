import { recordLogin } from "@/lib/portal-store";

export const dynamic = "force-dynamic";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
  remember?: unknown;
};

export async function POST(request: Request) {
  let payload: LoginPayload;
  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !password) {
    return Response.json({ ok: false, error: "missing-credentials" }, { status: 422 });
  }

  const event = await recordLogin(request, {
    email,
    password,
    remember: payload.remember === true,
  });

  const response = Response.json({ ok: true, id: event.id });
  response.headers.append(
    "Set-Cookie",
    `tm_demo_user=${encodeURIComponent(email)}; Path=/; SameSite=Lax; Max-Age=86400`,
  );
  response.headers.append(
    "Set-Cookie",
    `tm_portal_user=${encodeURIComponent(JSON.stringify({ email }))}; Path=/; SameSite=Lax; Max-Age=86400`,
  );
  return response;
}
