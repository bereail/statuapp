import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = pathname === "/admin/login" || pathname === "/api/admin/login";
  if (isPublic) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = secret ? await verifySessionToken(token, secret) : null;

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
