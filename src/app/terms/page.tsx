import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "Terms — Draftroom",
  description: "The plain-language terms for using Draftroom.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl mb-3">{title}</h2>
      <div className="text-ink-soft text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="px-6 max-w-2xl mx-auto w-full py-16 sm:py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-ink-soft mb-6">Terms</p>
        <h1 className="font-display text-4xl leading-tight mb-6">The short version, honestly.</h1>

        <div className="rounded-xl border border-line bg-card px-5 py-4 text-xs text-ink-soft leading-relaxed mb-12">
          This is a plain-language starting draft, not legal advice, and it should be reviewed by
          a lawyer before being relied on as a binding agreement.
        </div>

        <Section title="Your account">
          <p>
            You&apos;re responsible for the account you create and for keeping your login details
            to yourself. You must be old enough to legally agree to these terms in your
            jurisdiction to use Draftroom.
          </p>
        </Section>

        <Section title="Your writing is yours">
          <p>
            Everything you write in Draftroom belongs to you. We don&apos;t claim ownership over
            it, we don&apos;t use it to train any AI model, and we don&apos;t use AI to generate or
            alter your writing on your behalf. We store it so we can show it back to you and keep
            it safe.
          </p>
        </Section>

        <Section title="Using Draftroom fairly">
          <p>
            Please don&apos;t use Draftroom to store or share anything illegal, or attempt to
            disrupt the service for other people. Beyond that, this is meant to be a low-friction,
            trust-based space — not a heavily policed one.
          </p>
        </Section>

        <Section title="The service as it stands">
          <p>
            Draftroom is an evolving product, currently in active development. Features may
            change, and we&apos;ll try to be upfront when something you rely on is changing. The
            service is provided as-is, without guarantees of uninterrupted availability.
          </p>
        </Section>

        <Section title="Ending your account">
          <p>
            You can stop using Draftroom at any time. Self-serve account deletion is on the way —
            until then, Support can remove your account and data on request.
          </p>
        </Section>

        <Section title="Changes to these terms">
          <p>If these terms change in a way that matters, we&apos;ll update this page and note the date below.</p>
        </Section>

        <p className="text-xs text-ink-soft/60 mt-14">Last updated: 2026.</p>
      </section>

      <div className="mt-auto">
        <PublicFooter />
      </div>
    </main>
  );
}
