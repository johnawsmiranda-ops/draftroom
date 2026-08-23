"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPasswordAction, type ActionState } from "@/lib/actions/password-reset";
import { PasswordField } from "@/components/PasswordField";

export function ResetPasswordForm({ token }: { token: string | null }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    undefined,
  );

  if (!token) {
    return (
      <div className="rounded-lg border border-line bg-card px-4 py-3.5 text-sm text-ink-soft">
        That reset link is missing its token.{" "}
        <Link href="/forgot-password" className="text-accent">
          Request a new one
        </Link>
        .
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-line bg-card px-4 py-3.5 text-sm text-ink-soft">
          {state.success}
        </div>
        <Link
          href="/login"
          className="block text-center rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <PasswordField name="password" label="New password" placeholder="Enter a new password" minLength={8} />

      {state?.error && (
        <p className="text-sm text-accent">
          {state.error}{" "}
          <Link href="/forgot-password" className="underline underline-offset-4">
            Request a new link
          </Link>
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
