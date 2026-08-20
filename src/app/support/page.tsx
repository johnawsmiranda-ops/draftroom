import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SupportContactForm } from "@/components/SupportContactForm";

export const metadata: Metadata = {
  title: "Support — Draftroom",
  description: "How can we help? Search the Help Center, contact Support, or send feedback.",
};

export default function SupportPage() {
  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="px-6 max-w-2xl mx-auto w-full py-16 sm:py-20">
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4">How can we help?</h1>
        <p className="text-ink-soft text-lg mb-12 max-w-xl leading-relaxed">
          Whatever&apos;s going on — a question, a bug, or just a thought about the room — this is the
          place.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          <Link
            href="/help"
            className="rounded-2xl border border-line bg-card p-5 hover:border-ink transition-colors"
          >
            <p className="font-display text-base mb-1">Search Help Center</p>
            <p className="text-xs text-ink-soft">Browse guides on Glimpses, Writing Mode, and more.</p>
          </Link>
          <a
            href="mailto:support@draftroom.com"
            className="rounded-2xl border border-line bg-card p-5 hover:border-ink transition-colors"
          >
            <p className="font-display text-base mb-1">Contact Support</p>
            <p className="text-xs text-ink-soft">support@draftroom.com</p>
          </a>
          <a
            href="#contact-form"
            className="rounded-2xl border border-line bg-card p-5 hover:border-ink transition-colors"
          >
            <p className="font-display text-base mb-1">Send Feedback</p>
            <p className="text-xs text-ink-soft">Tell us what&apos;s working, or what isn&apos;t.</p>
          </a>
        </div>

        <div id="contact-form" className="scroll-mt-8">
          <h2 className="font-display text-2xl mb-6">Send us a message</h2>
          <SupportContactForm />
        </div>
      </section>

      <div className="mt-auto">
        <PublicFooter />
      </div>
    </main>
  );
}
