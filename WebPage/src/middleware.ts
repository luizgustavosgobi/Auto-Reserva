import { NextRequest, NextResponse, type MiddlewareConfig } from "next/server";

function redirectTo(path: string, request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = path;
  return NextResponse.redirect(redirectUrl);
}

// 'redirect' for home("/")
const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
] as const;

const PATH_WHEN_NOT_AUTHENTICATED_ROUTE = "/sign-in";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const authToken = request.cookies.get("token")?.value;

  if ((!authToken && publicRoute) || (authToken && !publicRoute)) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    return redirectTo(PATH_WHEN_NOT_AUTHENTICATED_ROUTE, request);
  }

  if (
    authToken &&
    publicRoute &&
    publicRoute.whenAuthenticated === "redirect"
  ) {
    return redirectTo("/", request);
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
