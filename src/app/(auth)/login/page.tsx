"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth-actions";
import { AuthShowcase } from "@/components/AuthShowcase";
import { PasswordField } from "@/components/PasswordField";
import { OAuthButtons } from "@/components/OAuthButtons";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, undefined);
  // Keep email controlled — Server Actions reset uncontrolled form fields
  // after each submission, so on a failed login (wrong password) the email
  // the person just typed would otherwise vanish along with the error.
  const [email, setEmail] = useState("");

  return (
    <main className="flex-1 flex bg-paper">
      <AuthShowcase />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl mb-1">Welcome back</h1>
          <p className="text-ink-soft text-sm mb-8">Your room is right where you left it.</p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.12em] text-ink-soft block mb-1.5">
                Email address
              </label>
              <div className="relative">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-lg border border-line bg-paper pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>

            <PasswordField name="password" label="Password" placeholder="Enter your password" />

            {state?.error && <p className="text-sm text-accent">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? "Opening the room…" : "Log in"}
            </button>

            <p className="text-center text-sm text-ink-soft">
              New here?{" "}
              <Link href="/signup" className="text-accent">
                Start your room
              </Link>
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="h-px flex-1 bg-line" />
              <span className="text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <OAuthButtons />
          </form>
        </div>
      </div>
    </main>
  );
}
