"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signupAction, type ActionState } from "@/lib/actions/auth-actions";
import { AuthShowcase } from "@/components/AuthShowcase";
import { PasswordField } from "@/components/PasswordField";
import { OAuthButtons } from "@/components/OAuthButtons";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signupAction, undefined);
  const [mismatch, setMismatch] = useState(false);
  // Controlled for the same reason as the login page — Server Actions clear
  // uncontrolled fields after submission, so a failed signup (e.g. email
  // already in use) would otherwise wipe out what was already typed.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
    if (password !== confirm) {
      e.preventDefault();
      setMismatch(true);
      return;
    }
    setMismatch(false);
  }

  return (
    <main className="flex-1 flex bg-paper">
      <AuthShowcase />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl mb-1">Create your account</h1>
          <p className="text-ink-soft text-sm mb-8">Start your creative journey.</p>

          <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.12em] text-ink-soft block mb-1.5">
                Full name
              </label>
              <div className="relative">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                >
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4.5 20c1.5-4 4.2-6 7.5-6s6 2 7.5 6" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <input
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-line bg-paper pl-9 pr-3.5 py-2.5 text-sm outline-none focus:border-ink transition-colors"
                />
              </div>
            </div>

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

            <PasswordField name="password" label="Password" placeholder="Create a password" minLength={8} />
            <PasswordField
              name="confirmPassword"
              label="Confirm password"
              placeholder="Confirm your password"
              minLength={8}
            />

            {mismatch && <p className="text-sm text-accent">Passwords don&apos;t match.</p>}
            {state?.error && <p className="text-sm text-accent">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? "Setting up your room…" : "Create account"}
            </button>

            <p className="text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link href="/login" className="text-accent">
                Log in
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

            <p className="text-center text-[11px] text-ink-soft flex items-center justify-center gap-1.5 pt-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              Your data is protected and secured.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
