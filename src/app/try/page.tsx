import type { Metadata } from "next";
import Link from "next/link";
import { SandboxEditor } from "@/components/SandboxEditor";

export const metadata: Metadata = {
  title: "Try Draftroom — no account needed",
  description: "Get a feel for Draftroom's writing room before you sign up. Nothing you type here is saved to an account.",
};

const LOCKED_NAV = ["Writing Dates", "Profile"];

export default function SandboxPage() {
  return (
    <div className="flex flex-1 bg-paper min-h-screen">
      <aside className="w-60 shrink-0 bg-room text-paper/90 flex flex-col h-screen sticky top-0">
        <Link href="/" className="font-display text-base tracking-wide px-6 pt-6 pb-8 block">
          DRAFTROOM
        </Link>

        <nav className="px-3 space-y-0.5 text-sm">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10">Home</div>
          {LOCKED_NAV.map((label) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-room-line"
              title="Sign up to unlock"
            >
              {label}
              <span className="text-[10px] uppercase tracking-wide">Locked</span>
            </div>
          ))}
        </nav>

        <div className="mt-8 px-6 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] text-room-line">Sandbox</span>
        </div>
        <div className="px-6 mt-2 text-sm text-room-line flex-1">
          You&apos;re trying Draftroom without an account — one scratch document, saved only in this
          browser.
        </div>

        <div className="px-6 py-5 border-t border-room-line/60">
          <Link
            href="/signup?from=sandbox"
            className="block text-center rounded-full bg-paper text-ink py-2.5 text-sm hover:opacity-90 transition-opacity"
          >
            Sign up to save your work
          </Link>
          <Link
            href="/login"
            className="block text-center text-xs text-room-line hover:text-paper mt-3 transition-colors"
          >
            Already have an account? Log in
          </Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <SandboxEditor />
      </div>
    </div>
  );
}
