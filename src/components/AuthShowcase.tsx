export function AuthShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between w-[45%] min-h-screen p-10 overflow-hidden bg-[linear-gradient(160deg,#efe4d0_0%,#e3d3b8_35%,#c9a97e_100%)]">
      {/* soft light streak, standing in for a window-lit desk photo */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.05)_30%,transparent_55%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-ink">
          <rect x="3" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 6.5c1.8 0 3 1.2 3 3s-3 6-3 6-3-4.2-3-6 1.2-3 3-3z" fill="currentColor" />
        </svg>
        <div>
          <p className="font-display text-base tracking-wide leading-none">DRAFTROOM</p>
          <p className="text-[11px] text-ink-soft mt-1">Your creative room.</p>
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="font-display text-5xl leading-[1.1] mb-5">
          Welcome to
          <br />
          Draftroom
        </h1>
        <p className="text-ink-soft text-base max-w-xs leading-relaxed">
          A place for your thoughts, your stories, and everything in between.
        </p>
      </div>

      {/* simple line-art stand-in for a desk scene: journal, mug, plant */}
      <div className="relative z-10 flex items-end gap-4 opacity-80 mb-8">
        <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
          <path
            d="M2 10c8-3 18-3 26 0v30c-8-3-18-3-26 0V10z"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-ink-soft"
          />
          <path
            d="M62 10c-8-3-18-3-26 0v30c8-3 18-3 26 0V10z"
            stroke="currentColor"
            strokeWidth="1.3"
            className="text-ink-soft"
          />
          <path d="M8 16h16M8 22h16M8 28h14" stroke="currentColor" strokeWidth="1" className="text-ink-soft/60" />
        </svg>
        <svg width="30" height="34" viewBox="0 0 30 34" fill="none" className="text-ink-soft">
          <path d="M4 10h18v16a9 9 0 01-9 9 9 9 0 01-9-9V10z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M22 13h3a4 4 0 010 8h-3" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        <svg width="26" height="40" viewBox="0 0 26 40" fill="none" className="text-ink-soft">
          <path d="M13 38V16" stroke="currentColor" strokeWidth="1.3" />
          <path d="M13 16c0-6-6-8-11-6 2 6 6 8 11 6z" stroke="currentColor" strokeWidth="1.3" />
          <path d="M13 22c0-5 5-7 10-5-2 5-6 7-10 5z" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </div>

      <div className="relative z-10 rounded-xl bg-ink/80 backdrop-blur-sm text-paper px-6 py-5 max-w-sm">
        <p className="font-display text-lg italic leading-snug mb-3">
          &ldquo;Sometimes chaos is simply an order that hasn&apos;t been understood.&rdquo;
        </p>
        <p className="text-xs text-paper/60 uppercase tracking-[0.15em]">The Draftroom philosophy</p>
      </div>
    </div>
  );
}
