"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { adminLoginAction, type AdminLoginState } from "@/lib/actions/admin-auth";
import { PasswordField } from "@/components/PasswordField";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<AdminLoginState, FormData>(
    adminLoginAction,
    undefined,
  );
  const [email, setEmail] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-room px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-xl tracking-wide text-paper">DRAFTROOM</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-room-line mt-1.5">Admin Panel</p>
        </div>

        <div className="rounded-2xl border border-room-line/60 bg-room-card p-6">
          <h1 className="font-display text-2xl text-paper mb-1">Sign in</h1>
          <p className="text-xs text-paper/50 mb-6">Administrator access only.</p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-room-line/60 bg-white/5 px-3.5 py-2.5 text-sm text-paper outline-none focus:border-paper/40 transition-colors"
              />
            </div>

            <PasswordField name="password" label="Password" placeholder="Enter your password" dark />

            {state?.error && <p className="text-sm text-accent">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className={`w-full rounded-full bg-accent text-paper py-2.5 text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 ${
                pending ? "is-busy" : ""
              }`}
            >
              {pending ? "Signing in…" : "Sign in to Admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-room-line mt-6">
          Not an administrator?{" "}
          <Link href="/login" className="text-paper/70 hover:text-paper underline">
            Writer sign-in
          </Link>
        </p>
      </div>
    </main>
  );
}
