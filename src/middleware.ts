import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = nextUrl.pathname.startsWith("/api/admin");

  const userRole = (req.auth?.user as any)?.role;
  if ((isAdminRoute || isApiAdminRoute) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
