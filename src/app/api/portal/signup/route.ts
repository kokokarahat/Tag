import { recordSignup } from "@/lib/portal-store";

export const dynamic = "force-dynamic";

type SignupPayload = Record<string, unknown>;

const text = (value: unknown, fallback = "") =>
  typeof value === "string" ? value.trim() : fallback;

export async function POST(request: Request) {
  let payload: SignupPayload;
  try {
    payload = (await request.json()) as SignupPayload;
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const email = text(payload.email);
  const password = text(payload.password);

  if (!email || !password) {
    return Response.json({ ok: false, error: "missing-credentials" }, { status: 422 });
  }

  const event = await recordSignup(request, {
    firstName: text(payload.firstName),
    lastName: text(payload.lastName),
    email,
    password,
    country: text(payload.country),
    phoneCode: text(payload.phoneCode),
    phone: text(payload.phone),
    accountType: payload.accountType === "company" ? "company" : "individual",
    companyName: text(payload.companyName),
    agreements: typeof payload.agreements === "number" ? payload.agreements : 0,
  });

  const response = Response.json({ ok: true, id: event.id });
  const profile = encodeURIComponent(
    JSON.stringify({
      email,
      firstName: event.firstName,
      lastName: event.lastName,
    }),
  );
  response.headers.append(
    "Set-Cookie",
    `tm_demo_user=${encodeURIComponent(email)}; Path=/; SameSite=Lax; Max-Age=86400`,
  );
  response.headers.append(
    "Set-Cookie",
    `tm_portal_user=${profile}; Path=/; SameSite=Lax; Max-Age=86400`,
  );
  return response;
}
