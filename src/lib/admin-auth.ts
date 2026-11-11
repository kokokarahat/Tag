import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Password gate for the demo admin console.
 *
 * The password comes from `ADMIN_PASSWORD` when present and otherwise falls
 * back to the demo value below. The cookie holds a hash of the password, so
 * rotating the env var invalidates every existing session.
 */

export const ADMIN_COOKIE = "tm_admin";
export const ADMIN_PASSWORD_FALLBACK = "tag2026!@#";

/**
 * Reads the admin password. In development the demo fallback keeps local work
 * frictionless; in production a missing `ADMIN_PASSWORD` disables the console
 * instead of silently shipping the well-known default.
 */
export function adminPassword(): string | null {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? null : ADMIN_PASSWORD_FALLBACK;
}

function digest(value: string): string {
  return createHash("sha256").update(`tagmarkets-admin:${value}`).digest("hex");
}

export function adminCookieValue(): string {
  const password = adminPassword();
  return password ? digest(password) : "";
}

export function isValidAdminPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected || !input) return false;
  const expectedBuffer = Buffer.from(expected);
  const givenBuffer = Buffer.from(input);
  if (expectedBuffer.length !== givenBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, givenBuffer);
}

export function isValidAdminCookie(value: string | undefined): boolean {
  const expected = adminCookieValue();
  if (!value || !expected) return false;
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidAdminCookie(store.get(ADMIN_COOKIE)?.value);
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 8,
};
