"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Wrong password. Try again.");
        setPending(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9f95a] text-sm font-black text-black">
            TM
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">Tag Markets</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
              Admin console
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h1 className="text-lg font-semibold text-white">Sign in</h1>
          <p className="mt-1 text-xs text-neutral-500">
            This console is restricted. Enter the admin password to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-5">
            <label
              htmlFor="adminPassword"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500"
            >
              Password
            </label>
            <input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              autoFocus
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-[#c9f95a]/60 focus:outline-none"
              placeholder="••••••••••"
            />

            {error ? (
              <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending || password.length === 0}
              className="mt-5 w-full rounded-xl bg-[#c9f95a] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#d7ff70] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pending ? "Checking…" : "Unlock console"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[11px] text-neutral-600">
          Demo console · captured credentials are stored locally
        </p>
      </div>
    </div>
  );
}
