"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/lib/actions/admin";

// Generates a readable but reasonably strong starter password the admin can
// pass along — beats everyone reusing "password123".
function suggestPassword() {
  const words = ["quiet", "paper", "ember", "lantern", "willow", "amber", "harbor", "meadow"];
  const a = words[Math.floor(Math.random() * words.length)];
  const b = words[Math.floor(Math.random() * words.length)];
  const n = Math.floor(Math.random() * 90 + 10);
  return `${a}-${b}-${n}`;
}

export function CreateUserForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setName("");
    setEmail("");
    setPassword("");
    setPlan("free");
    setRole("user");
    setError(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("password", password);
    fd.set("plan", plan);
    fd.set("role", role);

    startTransition(() => {
      createUserAction(fd).then((res) => {
        if (res && !res.ok) {
          setError(res.error ?? "Something went wrong.");
          return;
        }
        setCreated({ email: email.trim().toLowerCase(), password });
        reset();
        setOpen(false);
        router.refresh();
      });
    });
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setCreated(null);
            setPassword(suggestPassword());
            setOpen(true);
          }}
          className="text-xs rounded-full bg-ink text-paper px-4 py-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          + Create user
        </button>
      </div>

      {created && (
        <div className="mt-3 rounded-xl border border-line bg-sticky-sage/30 px-4 py-3 text-sm">
          <p className="font-semibold mb-1">Account created</p>
          <p className="text-ink-soft text-xs leading-relaxed">
            Send these credentials to {created.email} yourself — Draftroom doesn&apos;t email them.
            This is the only time the password is shown.
          </p>
          <p className="mt-2 font-mono text-xs bg-card border border-line rounded px-2.5 py-1.5 inline-block">
            {created.password}
          </p>
          <button
            onClick={() => setCreated(null)}
            className="block mt-2 text-[11px] text-ink-soft hover:text-ink underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setOpen(false)}
        >
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-room text-paper p-6 sm:p-7 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <h2 className="font-display text-2xl">Create User</h2>
                <p className="text-sm text-paper/60 mt-1">Adds an account directly, no signup needed.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-paper/50 hover:text-paper text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  className="w-full bg-white/5 border border-room-line/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-paper/40"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-room-line/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-paper/40"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                  Temporary password
                </label>
                <div className="flex gap-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="flex-1 min-w-0 bg-white/5 border border-room-line/60 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-paper/40"
                  />
                  <button
                    type="button"
                    onClick={() => setPassword(suggestPassword())}
                    className="text-xs rounded-xl border border-room-line/60 px-3 text-paper/70 hover:text-paper shrink-0"
                  >
                    New
                  </button>
                </div>
                <p className="text-[11px] text-paper/40 mt-1.5">
                  You&apos;ll need to pass this to them yourself — nothing is emailed.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                    Plan
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value as "free" | "premium")}
                    className="w-full bg-white/5 border border-room-line/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-paper/40"
                  >
                    <option value="free" className="text-ink">
                      Free
                    </option>
                    <option value="premium" className="text-ink">
                      Premium
                    </option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.12em] text-paper/50 block mb-1.5">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "user" | "admin")}
                    className="w-full bg-white/5 border border-room-line/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-paper/40"
                  >
                    <option value="user" className="text-ink">
                      User
                    </option>
                    <option value="admin" className="text-ink">
                      Admin
                    </option>
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-accent">{error}</p>}
            </div>

            <div className="mt-7 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm rounded-full border border-room-line/60 px-5 py-2.5 text-paper/70 hover:text-paper"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className={`text-sm rounded-full bg-accent text-paper px-6 py-2.5 shadow-md hover:opacity-90 transition-opacity disabled:opacity-40 ${
                  pending ? "is-busy" : ""
                }`}
              >
                {pending ? "Creating…" : "Create User"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
