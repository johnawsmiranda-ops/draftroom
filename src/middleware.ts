export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/home",
    "/projects/:path*",
    "/writing-dates/:path*",
  ],
};
