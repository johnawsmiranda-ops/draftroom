import Link from "next/link";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-ink-soft hover:text-ink transition-colors">
      {children}
    </Link>
  );
}

// Product pages that don't exist yet (Pricing tiers, Templates gallery,
// Features tour, Community) — rendered as plain labels rather than links
// to nowhere. Wire these up once those pages actually ship.
function FooterPlaceholder({ children }: { children: React.ReactNode }) {
  return <span className="block text-ink-soft/50 cursor-default">{children}</span>;
}

export function PublicFooter() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-2 sm:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-lg mb-2">DRAFTROOM</p>
          <p className="text-sm text-ink-soft leading-relaxed max-w-[26ch]">
            Your creative room for ideas and writing.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft/70 mb-1">Product</p>
          <FooterPlaceholder>Features</FooterPlaceholder>
          <FooterPlaceholder>Templates</FooterPlaceholder>
          <FooterPlaceholder>Community</FooterPlaceholder>
          <FooterPlaceholder>Pricing</FooterPlaceholder>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft/70 mb-1">Resources</p>
          <FooterLink href="/help">Help Center</FooterLink>
          <FooterLink href="/help">Writing Guides</FooterLink>
          <FooterLink href="/about">About</FooterLink>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs uppercase tracking-[0.15em] text-ink-soft/70 mb-1">Company</p>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/support">Contact</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-ink-soft/70 mb-2">Support</p>
        <a href="mailto:support@draftroom.com" className="text-sm text-ink-soft hover:text-ink transition-colors">
          support@draftroom.com
        </a>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-6 text-xs text-ink-soft/60">
          © 2026 Draftroom — A MindCrossed product
        </div>
      </div>
    </footer>
  );
}
