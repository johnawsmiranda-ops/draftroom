"use server";

import { signIn } from "@/lib/auth";

/** Whether Google sign-in is configured — read on the server, passed to the UI. */
export async function isGoogleEnabled() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/home" });
}
