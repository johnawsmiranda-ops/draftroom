import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — Draftroom",
  description: "What Draftroom collects, why, and how your writing is (and isn't) used.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl mb-3">{title}</h2>
      <div className="text-ink-soft text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="px-6 max-w-2xl mx-auto w-full py-16 sm:py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-ink-soft mb-6">Privacy Policy</p>
        <h1 className="font-display text-4xl leading-tight mb-6">Your words stay yours.</h1>

        <div className="rounded-xl border border-line bg-card px-5 py-4 text-xs text-ink-soft leading-relaxed mb-12">
          This is a plain-language starting draft, written to accurately describe how Draftroom
          works today. It isn&apos;t legal advice, and it should be reviewed by a lawyer before
          being relied on as a binding policy.
        </div>

        <Section title="What we collect">
          <p>
            An account needs an email address, a password (stored as a one-way hash, never in
            plain text), and optionally a display name and profile photo. Everything you write —
            Glimpses, documents, chapters, writing dates — is stored so Draftroom can show it back
            to you. A session cookie keeps you logged in.
          </p>
        </Section>

        <Section title="What we don't do">
          <p>
            Draftroom doesn&apos;t use AI to read, generate, or suggest changes to your writing.
            Your words aren&apos;t used to train any model, ours or anyone else&apos;s. We don&apos;t
            sell your data, and we don&apos;t currently run third-party analytics or advertising
            trackers on the site.
          </p>
        </Section>

        <Section title="Who can see your writing">
          <p>
            Only you. Every Glimpse, document, and chapter is scoped to your account. Nothing you
            write is public or shared with other users unless a sharing feature explicitly says
            otherwise (Draftroom doesn&apos;t have one yet).
          </p>
        </Section>

        <Section title="Where it's stored">
          <p>
            Account and writing data is stored in a managed Postgres database. Uploaded profile
            photos are processed in your browser before upload.
          </p>
        </Section>

        <Section title="Support messages">
          <p>
            If you contact Support through the form on this site, we store your name, email,
            subject, and message so we can respond to you.
          </p>
        </Section>

        <Section title="Deleting your data">
          <p>
            Self-serve account deletion isn&apos;t built yet. Until it is, contact Support and
            we&apos;ll remove your account and its data.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If this policy changes in a way that matters, we&apos;ll update this page and note the
            date below.
          </p>
        </Section>

        <p className="text-xs text-ink-soft/60 mt-14">Last updated: 2026.</p>
      </section>

      <div className="mt-auto">
        <PublicFooter />
      </div>
    </main>
  );
}
