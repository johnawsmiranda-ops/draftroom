export { auth as middleware } from "@/lib/auth-edge";

export const config = {
  matcher: [
    "/home",
    "/projects/:path*",
    "/writing-dates/:path*",
    "/profile/:path*",
    // /admin is intentionally NOT matched here: it has its own sign-in page at
    // /admin/login, and the panel layout's requireAdmin() does the real check
    // (middleware runs on the edge with no database access, so it couldn't
    // verify the admin role anyway).
  ],
};
