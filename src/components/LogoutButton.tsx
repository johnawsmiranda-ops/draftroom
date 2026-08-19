"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="text-xs text-room-line hover:text-paper transition-colors"
    >
      Sign out
    </button>
  );
}
