import Link from "next/link";
import { getUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const user = await getUser();
  if (user) redirect("/home");

  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="font-display text-lg tracking-wide">DRAFTROOM</span>
        <nav className="flex items-center gap-6 text-sm text-ink-soft">
          <Link href="/login" className="hover:text-ink transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Start your room
          </Link>
        </nav>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto">
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
        <Link
          href="/signup"
          className="rounded-full bg-ink text-paper px-8 py-3.5 text-base hover:opacity-90 transition-opacity"
        >
          Enter Draftroom
        </Link>
      </section>

      <footer className="text-center text-xs text-ink-soft/70 py-8">
        Draftroom — leave something behind.
      </footer>
    </main>
  );
}
