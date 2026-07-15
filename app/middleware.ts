import { NextRequest, NextResponse } from "next/server";

function hostname(host: string): string {
  return host.replace(/:\d+$/, "");
}

export function middleware(req: NextRequest) {
  const raw = req.headers.get("host") ?? "";
  const host = hostname(raw);
  const url = req.nextUrl.clone();

  // skip subdomain routing in dev — both client + admin on localhost
  if (host === "localhost") return NextResponse.next();

  const isAdminDomain = host.startsWith("admin.");

  // --- CLIENT domain: block /admin/* ---
  if (!isAdminDomain && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  // --- ADMIN subdomain: only serve /admin/* ---
  if (isAdminDomain) {
    if (url.pathname.startsWith("/admin")) {
      return NextResponse.next();
    }
    // rewrite / → /admin
    if (url.pathname === "/") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    // everything else → 404 in admin
    return NextResponse.rewrite(new URL("/admin/404", url.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
