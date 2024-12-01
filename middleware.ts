import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/app/:path*", "/app", "/signin", "/sign-up", "/", "/verify/:path*", "/settings"],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token && (url.pathname.startsWith("/signin") || url.pathname === "/")) {
        return NextResponse.redirect(new URL("/app", request.url));
    }

    if (!token && (url.pathname.startsWith("/app") || url.pathname.startsWith("/settings"))) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}
