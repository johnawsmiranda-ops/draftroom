import { getUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default async function LandingPage() {
  const user = await getUser();
  if (user) redirect("/home");

  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="flex flex-col items-center text-center px-6 max-w-3xl mx-auto pt-10 sm:pt-14 pb-14">
        <p className="text-sm uppercase tracking-[0.25em] text-ink-soft mb-6">
          A creative playground for writers
        </p>
        <h1 className="font-display text-5xl sm:text-6xl leading-tight mb-6">
          Your ideas deserve a place to live
          <br />
          <span className="italic text-accent">until you&apos;re ready</span> for them.
        </h1>
        <p className="text-ink-soft text-lg max-w-xl mb-10 leading-relaxed">
          Sometimes chaos is simply an order that hasn&apos;t been understood. Draftroom gives
          your fragments — a line, a scene, a voice thought — a beautiful place to land, and
          welcomes you back when you&apos;re ready to write.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-ink text-paper px-8 py-3.5 text-base hover:opacity-90 transition-opacity"
          >
            Enter Draftroom
          </Link>
          <Link
            href="/try"
            className="text-sm text-ink-soft hover:text-ink transition-colors underline underline-offset-4"
          >
            Try it first — no account needed
          </Link>
        </div>

        <p className="text-xs uppercase tracking-[0.15em] text-ink-soft/70 mt-10">
          Write &nbsp;·&nbsp; Glimpse &nbsp;·&nbsp; Writing Dates
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-3">What&apos;s inside</p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4">
            A quiet room, three ways to fill it.
          </h2>
          <p className="text-ink-soft leading-relaxed">
            No dashboards to learn, no settings to configure first. Open the room and start.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-accent mb-3">Write</p>
            <h3 className="font-display text-xl mb-2">A clean page for the real writing</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              Open a distraction-free editor, organize chapters as you go, and let every draft
              save itself as you type — nothing to click, nothing to lose.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-accent mb-3">Glimpse</p>
            <h3 className="font-display text-xl mb-2">Somewhere for the in-between thoughts</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              A line that hits you on the train, a quote, a scene fragment — catch it before it
              slips, tag it, and find it again when you need it.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <p className="text-xs uppercase tracking-[0.15em] text-accent mb-3">Writing Dates</p>
            <h3 className="font-display text-xl mb-2">A reason to come back</h3>
            <p className="text-ink-soft text-sm leading-relaxed">
              Set a time for yourself, and Draftroom will hold your place — showing you exactly
              what you left behind when you return.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-8 text-center border-t border-line pt-12">
          <div>
            <p className="font-display text-lg mb-1">Private by default</p>
            <p className="text-ink-soft text-sm">Your writing is yours. We don&apos;t read it or sell it.</p>
          </div>
          <div>
            <p className="font-display text-lg mb-1">Anywhere, any device</p>
            <p className="text-ink-soft text-sm">Sign in on your laptop, phone, or a library computer.</p>
          </div>
          <div>
            <p className="font-display text-lg mb-1">Built to stay out of the way</p>
            <p className="text-ink-soft text-sm">No feeds, no likes, no noise — just the page.</p>
          </div>
          <div>
            <p className="font-display text-lg mb-1">Try before you commit</p>
            <p className="text-ink-soft text-sm">
              <Link href="/try" className="text-accent hover:underline underline-offset-4">
                Explore the sandbox
              </Link>{" "}
              with no account at all.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16 sm:py-20 text-center border-t border-line">
        <p className="text-xs uppercase tracking-[0.2em] text-ink-soft mb-6">
          A note from the founder
        </p>
        <p className="font-display text-2xl sm:text-3xl leading-relaxed italic mb-6">
          &ldquo;Draftroom began with a simple belief: ideas deserve a place to stay.&rdquo;
        </p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-ink-soft">&mdash; John Miranda,</p>
          <Image
            src="/draftsman.png"
            alt="The Draftroom draftsman"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
