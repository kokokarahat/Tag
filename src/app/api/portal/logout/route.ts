export const dynamic = "force-dynamic";

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append(
    "Set-Cookie",
    "tm_demo_user=; Path=/; SameSite=Lax; Max-Age=0",
  );
  return response;
}
