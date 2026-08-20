import { getUser } from "@/lib/current-user";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export default async function LandingPage() {
  const user = await getUser();
  if (user) redirect("/home");

  return (
    <main className="flex-1 flex flex-col bg-paper paper-texture">
      <PublicHeader />

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto py-16">
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

      <PublicFooter />
    </main>
  );
}
