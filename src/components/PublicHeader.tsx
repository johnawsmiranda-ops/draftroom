import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="px-6 sm:px-8 py-6 max-w-6xl mx-auto w-full flex items-center justify-between">
      <Link href="/" className="font-display text-lg tracking-wide shrink-0">
        DRAFTROOM
      </Link>

      <nav className="hidden sm:flex items-center gap-7 text-sm text-ink-soft">
        <Link href="/about" className="hover:text-ink transition-colors">
          About
        </Link>
        <Link href="/help" className="hover:text-ink transition-colors">
          Help
        </Link>
        <Link href="/support" className="hover:text-ink transition-colors">
          Support
        </Link>
      </nav>

      <div className="flex items-center gap-4 sm:gap-6 text-sm">
        <Link href="/login" className="text-ink-soft hover:text-ink transition-colors">
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Start your room
        </Link>
      </div>
    </header>
  );
}
