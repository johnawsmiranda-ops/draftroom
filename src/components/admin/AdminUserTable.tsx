"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import {
  deleteUserAction,
  setUserPasswordAction,
  setUserPlanAction,
  setUserRoleAction,
  setUserStatusAction,
  type AdminUserRow,
} from "@/lib/actions/admin";

function Pill({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "neutral" }) {
  const tones = {
    green: "bg-sticky-sage/60 text-ink",
    amber: "bg-sticky-peach/70 text-ink",
    red: "bg-accent/15 text-accent",
    neutral: "bg-paper-deep text-ink-soft",
  };
  return <span className={`text-[11px] rounded-full px-2 py-0.5 ${tones[tone]}`}>{label}</span>;
}

function RowMenu({ user, onDone }: { user: AdminUserRow; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(() => {
      fn().then((res) => {
        if (res && !res.ok) setError(res.error ?? "Something went wrong.");
        else {
          setOpen(false);
          onDone();
        }
      });
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className={`px-2 py-1 rounded text-ink-soft hover:bg-paper-deep hover:text-ink ${
          pending ? "is-busy" : ""
        }`}
        aria-label={`Actions for ${user.email}`}
      >
        ⋯
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 rounded-xl border border-line bg-card shadow-xl overflow-hidden z-20 text-sm">
            <button
              onClick={() => run(() => setUserPlanAction(user.id, user.plan === "premium" ? "free" : "premium"))}
              className="block w-full text-left px-4 py-2.5 hover:bg-paper-deep"
            >
              {user.plan === "premium" ? "Downgrade to Free" : "Upgrade to Premium"}
            </button>
            <button
              onClick={() =>
                run(() => setUserStatusAction(user.id, user.status === "disabled" ? "active" : "disabled"))
              }
              className="block w-full text-left px-4 py-2.5 hover:bg-paper-deep border-t border-line"
            >
              {user.status === "disabled" ? "Re-enable account" : "Disable account"}
            </button>
            <button
              onClick={() => run(() => setUserRoleAction(user.id, user.role === "admin" ? "user" : "admin"))}
              className="block w-full text-left px-4 py-2.5 hover:bg-paper-deep border-t border-line"
            >
              {user.role === "admin" ? "Revoke admin" : "Make admin"}
            </button>
            <button
              onClick={() => {
                const pw = prompt(
                  `Set a new password for ${user.email}.\nYou'll need to pass it to them yourself — nothing is emailed.`,
                );
                if (!pw) return;
                run(() => setUserPasswordAction(user.id, pw));
              }}
              className="block w-full text-left px-4 py-2.5 hover:bg-paper-deep border-t border-line"
            >
              Reset password
            </button>
            <button
              onClick={() => {
                if (
                  !confirm(
                    `Permanently delete ${user.email}? This erases all their projects, writing, and glimpses. This can't be undone.`,
                  )
                ) {
                  return;
                }
                run(() => deleteUserAction(user.id));
              }}
              className="block w-full text-left px-4 py-2.5 text-accent hover:bg-paper-deep border-t border-line"
            >
              Delete user
            </button>
            {error && <p className="px-4 py-2 text-[11px] text-accent border-t border-line">{error}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export function AdminUserTable({
  rows,
  total,
  page,
  pages,
  query,
}: {
  rows: AdminUserRow[];
  total: number;
  page: number;
  pages: number;
  query: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    router.push(`/admin?${params.toString()}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    router.push(`/admin?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-line">
        <h2 className="font-display text-lg">Manage Users</h2>
        <form onSubmit={applySearch} className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="text-sm rounded-lg border border-line bg-paper px-3 py-1.5 outline-none focus:border-ink"
          />
          <button type="submit" className="text-xs rounded-full bg-ink text-paper px-3.5 py-2">
            Search
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-3 py-3 font-normal">Email</th>
              <th className="px-3 py-3 font-normal">Plan</th>
              <th className="px-3 py-3 font-normal">Status</th>
              <th className="px-3 py-3 font-normal">Content</th>
              <th className="px-3 py-3 font-normal">Joined</th>
              <th className="px-3 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={u.name} avatarUrl={u.avatarUrl} size={28} />
                    <span className="truncate">{u.name ?? "—"}</span>
                    {u.role === "admin" && <Pill label="Admin" tone="amber" />}
                  </div>
                </td>
                <td className="px-3 py-3 text-ink-soft truncate max-w-[220px]">{u.email}</td>
                <td className="px-3 py-3">
                  <Pill label={u.plan === "premium" ? "Premium" : "Free"} tone={u.plan === "premium" ? "green" : "neutral"} />
                </td>
                <td className="px-3 py-3">
                  <Pill
                    label={u.status === "disabled" ? "Disabled" : "Active"}
                    tone={u.status === "disabled" ? "red" : "green"}
                  />
                </td>
                <td className="px-3 py-3 text-ink-soft text-xs whitespace-nowrap">
                  {u.projectCount} proj · {u.glimpseCount} glimpses
                </td>
                <td className="px-3 py-3 text-ink-soft text-xs whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end">
                    <RowMenu user={u} onDone={() => router.refresh()} />
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-ink-soft">
                  No users match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-5 py-3 border-t border-line text-xs text-ink-soft">
        <span>
          {total.toLocaleString()} {total === 1 ? "user" : "users"} total
        </span>
        {pages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="px-2 py-1 rounded hover:bg-paper-deep disabled:opacity-30"
            >
              ‹
            </button>
            <span className="px-2">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= pages}
              className="px-2 py-1 rounded hover:bg-paper-deep disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
