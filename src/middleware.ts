export { auth as middleware } from "@/lib/auth-edge";

export const config = {
  matcher: ["/home", "/projects/:path*", "/writing-dates/:path*"],
};
