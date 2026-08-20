import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export const metadata: Metadata = {
  title: "About — Draftroom",
  description: "Why Draftroom exists: a home for the ideas that arrive before you're ready for them.",
};

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="px-6 max-w-2xl mx-auto w-full py-16 sm:py-24">
        <p className="text-sm uppercase tracking-[0.25em] text-ink-soft mb-6">Why Draftroom exists</p>

        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-10">
          Ideas rarely arrive when we&apos;re ready for them.
        </h1>

        <div className="space-y-6 text-ink-soft text-lg leading-relaxed">
          <p>
            A sentence appears while you&apos;re walking somewhere else entirely. A story idea
            comes right before sleep, half-formed and already fading. A thought disappears
            because there was nowhere to put it down — no page open, no pen in hand, nothing
            but the moment passing.
          </p>

          <p>Draftroom was created to give those ideas a home.</p>

          <p>
            Not a place to finish them. Not a place that finishes them for you. Just a place to
            catch them — a line, a scene, a voice memo recorded at a red light — and set them
            down somewhere they&apos;ll still be there later.
          </p>

          <p>
            Because creative work was never a straight line. It&apos;s fragments before it&apos;s
            a draft. It&apos;s pauses before it&apos;s progress. It&apos;s the same idea, returned
            to three times over as many weeks, a little more itself each time. Draftroom is built
            around that rhythm instead of against it — a room to collect the glimpse, a separate
            room to develop it when you&apos;re ready, and a way back to everything in between.
          </p>

          <p>
            Nothing here writes for you. What ends up on the page is yours — every word of it,
            start to finish. Draftroom just tries to make sure fewer of your ideas get lost on
            the way to becoming something.
          </p>
        </div>

        <p className="font-display italic text-2xl text-accent mt-14">
          Your ideas. Your words. Your room.
        </p>
      </section>

      <div className="mt-auto">
        <PublicFooter />
      </div>
    </main>
  );
}
