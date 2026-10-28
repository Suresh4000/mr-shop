"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAdminAction } from "@/actions/auth";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);
  const searchParams = useSearchParams();
  const forbidden = searchParams.get("error") === "forbidden";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white/70 p-8 shadow-sm backdrop-blur">
        <div className="mb-8 text-center">
          <Link href="/" className="font-serif text-3xl tracking-wide text-[var(--foreground)]">
            MR SHOP
          </Link>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">
            Store Management Portal
          </p>
        </div>

        {forbidden && !state?.error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Admin access required. Please sign in with an authorized administrator account.
          </div>
        )}

        {state?.error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="admin@mrshop.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]/80"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-white px-3.5 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--foreground)]/40 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Signing in..." : "Sign In to Admin"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-xs text-[var(--foreground)]/60 transition hover:text-[var(--accent)]"
          >
            &larr; Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <LoginForm />
    </Suspense>
  );
}

