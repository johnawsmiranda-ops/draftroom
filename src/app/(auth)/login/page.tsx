"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth-actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, undefined);

  return (
    <main className="flex-1 flex items-center justify-center bg-paper paper-texture px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-lg tracking-wide block text-center mb-10">
          DRAFTROOM
        </Link>
        <div className="bg-card border border-line rounded-2xl p-8 shadow-sm">
          <h1 className="font-display text-2xl mb-1">Welcome back</h1>
          <p className="text-ink-soft text-sm mb-6">Your room is right where you left it.</p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-sm text-ink-soft block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <label className="text-sm text-ink-soft block mb-1.5">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-ink transition-colors"
              />
            </div>
            {state?.error && <p className="text-sm text-accent">{state.error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {pending ? "Opening the room…" : "Log in"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-ink-soft mt-6">
          New here?{" "}
          <Link href="/signup" className="text-ink underline underline-offset-4">
            Start your room
          </Link>
        </p>
      </div>
    </main>
  );
}
