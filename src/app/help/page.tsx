import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { HelpCenter } from "@/components/HelpCenter";

export const metadata: Metadata = {
  title: "Help Center — Draftroom",
  description: "A writer's guide to Draftroom — Glimpse Mode, Writing Mode, projects, export, and account help.",
};

export default function HelpPage() {
  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="px-6 max-w-3xl mx-auto w-full py-16 sm:py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-ink-soft mb-6">Help Center</p>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-4">A writer&apos;s guide to the room.</h1>
        <p className="text-ink-soft text-lg mb-14 max-w-xl leading-relaxed">
          Everything here is written the way we&apos;d explain it to a friend, not a support
          ticket. Search below, or browse by category.
        </p>

        <HelpCenter />
      </section>

      <div className="mt-auto">
        <PublicFooter />
      </div>
    </main>
  );
}
