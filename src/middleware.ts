export { auth as middleware } from "@/lib/auth-edge";

export const config = {
  matcher: [
    "/home",
    "/projects/:path*",
    "/writing-dates/:path*",
    "/profile/:path*",
    // Signed-in check only — the admin role itself is verified server-side in
    // requireAdmin(), since middleware runs on the edge without DB access.
    "/admin/:path*",
  ],
};
