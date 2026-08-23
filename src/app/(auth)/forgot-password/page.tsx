"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordResetAction, type ActionState } from "@/lib/actions/password-reset";
import { AuthShowcase } from "@/components/AuthShowcase";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestPasswordResetAction,
    undefined,
  );

  return (
    <main className="flex-1 flex bg-paper">
      <AuthShowcase />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl mb-1">Forgot your password?</h1>
          <p className="text-ink-soft text-sm mb-8">
            Enter the email on your account and we&apos;ll send you a link to set a new one.
          </p>

          {state?.success ? (
            <div className="rounded-lg border border-line bg-card px-4 py-3.5 text-sm text-ink-soft">
              {state.success}
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.12em] text-ink-soft block mb-1.5">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink transition-colors"
                />
              </div>

              {state?.error && <p className="text-sm text-accent">{state.error}</p>}

              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-ink-soft mt-6">
            <Link href="/login" className="text-accent">
              Back to log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
