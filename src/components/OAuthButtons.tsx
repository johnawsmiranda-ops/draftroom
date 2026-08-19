"use client";

// Google/Apple sign-in aren't wired up yet — that needs OAuth app credentials
// (a Google Cloud OAuth client, an Apple Services ID) that only the account
// owner can create. These are placeholders so the layout matches the design;
// wiring them up for real is a follow-up once those credentials exist.
export function OAuthButtons() {
  function comingSoon(provider: string) {
    alert(`${provider} sign-in isn't connected yet — coming soon.`);
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => comingSoon("Google")}
        className="flex items-center justify-center gap-2 rounded-lg border border-line bg-card py-2.5 text-sm hover:bg-paper-deep transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z"
          />
          <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4A12 12 0 000 12c0 1.9.5 3.8 1.4 5.5l4-3.1z" />
          <path
            fill="#EA4335"
            d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
          />
        </svg>
        Google
      </button>
      <button
        type="button"
        onClick={() => comingSoon("Apple")}
        className="flex items-center justify-center gap-2 rounded-lg border border-line bg-card py-2.5 text-sm hover:bg-paper-deep transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.7 1c.1 1.2-.4 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.1-1.5 3.1-1.6zM20.9 17.2c-.5 1.2-1.1 2.3-1.9 3.4-1 1.4-2 2.8-3.6 2.8-1.6 0-2.1-1-3.9-1-1.9 0-2.4 1-3.9 1-1.6 0-2.7-1.5-3.7-2.9C1.9 18.2.8 14.6 2 12.1c.7-1.6 2.1-2.6 3.6-2.6 1.6 0 2.6 1.1 3.9 1.1 1.3 0 2.1-1.1 3.9-1.1 1.4 0 2.9.8 3.9 2.1-3.4 1.9-2.8 6.8.4 8.1-.3.6-.5 1-.8 1.5z" />
        </svg>
        Apple
      </button>
    </div>
  );
}
