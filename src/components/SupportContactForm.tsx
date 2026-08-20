"use client";

import { useState, useTransition } from "react";
import { submitSupportMessageAction } from "@/lib/actions/support";

export function SupportContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("subject", subject);
    formData.set("message", message);

    startTransition(async () => {
      const result = await submitSupportMessageAction(formData);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-line bg-card p-8 text-center">
        <p className="font-display text-xl mb-2">Got it.</p>
        <p className="text-sm text-ink-soft">
          Thanks for writing in — we&apos;ll get back to you at {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-ink-soft block mb-2">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            className="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink/40 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-ink-soft block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={200}
            className="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.15em] text-ink-soft block mb-2">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          maxLength={200}
          className="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink/40 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.15em] text-ink-soft block mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          maxLength={4000}
          className="w-full bg-card border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink/40 transition-colors resize-y"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink text-paper px-7 py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {pending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
