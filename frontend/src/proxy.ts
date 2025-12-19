import { type NextRequest } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/forget-password",
  "/reset-password",
]);

const PROTECTED_ROUTES = ["/dashboard", "/properties", "/tenants", "/units"];

function normalizePath(pathname: string) {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  // const pathname = normalizePath(request.nextUrl.pathname);
  // console.log("Proxy checking path:", pathname);

  // if (PUBLIC_ROUTES.has(pathname)) {
  //   return NextResponse.next();
  // }

  // const needsAuth = PROTECTED_ROUTES.some((route) =>
  //   pathname.startsWith(route)
  // );

  // if (!needsAuth) {
  //   return NextResponse.next();
  // }

  // const accessToken = request.cookies.get(TOKEN_KEYS.ACCESS_TOKEN)?.value;
  // const refreshToken = request.cookies.get(TOKEN_KEYS.REFRESH_TOKEN)?.value;

  // if (!accessToken && !refreshToken) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/sign-in";
  //   url.searchParams.set("redirect", pathname);
  //   return NextResponse.redirect(url);
  // }

  // if (accessToken && !isTokenExpired(accessToken)) {
  //   return NextResponse.next();
  // }

  // if (refreshToken) {
  //   try {
  //     const data = await refreshService.refreshAccessToken(refreshToken);

  //     if (data?.tokens?.accessToken && data?.tokens?.refreshToken) {
  //       const response = NextResponse.next();

  //       response.cookies.set(TOKEN_KEYS.ACCESS_TOKEN, data.tokens.accessToken, {
  //         httpOnly: true,
  //         secure: process.env.NODE_ENV === "production",
  //         sameSite: "lax",
  //         path: "/",
  //         maxAge: 60 * 15, // 15 minutes
  //       });

  //       response.cookies.set(
  //         TOKEN_KEYS.REFRESH_TOKEN,
  //         data.tokens.refreshToken,
  //         {
  //           httpOnly: true,
  //           secure: process.env.NODE_ENV === "production",
  //           sameSite: "lax",
  //           path: "/",
  //           maxAge: 60 * 60 * 24 * 7, // 7 days
  //         }
  //       );

  //       return response;
  //     }
  //   } catch (error) {
  //     console.error("Proxy token refresh failed:", error);
  //   }

  //   console.log(
  //     "❌ Token refresh failed (refresh token invalid/expired), clearing cookies and redirecting"
  //   );
  // }

  // const url = request.nextUrl.clone();
  // url.pathname = "/sign-in";
  // url.searchParams.set("redirect", pathname);

  // const response = NextResponse.redirect(url);

  // response.cookies.delete(TOKEN_KEYS.ACCESS_TOKEN);
  // response.cookies.delete(TOKEN_KEYS.REFRESH_TOKEN);
  // response.cookies.delete(TOKEN_KEYS.USER);

  // return response;
}

/**
 * Configure where Proxy runs.
 * We match all "normal" page requests but exclude internal assets/APIs.
 * Adjust if you want to change the scope.
 *
 * See Next.js docs for examples and advanced matchers.
 */
export const config = {
  matcher: [
    // match all paths except common internal/static/metadata routes
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
