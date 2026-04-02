import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { buildLoginRedirectPath, isPublicPath } from "@/lib/auth-utils";

function getPublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getPublicEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getPublicEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims ?? null;

  const pathname = request.nextUrl.pathname;

  if (isPublicPath(pathname)) {
    return response;
  }

  const isAuthenticated = Boolean(claims?.sub);

  if (!isAuthenticated) {
    const loginPath = buildLoginRedirectPath(pathname, request.nextUrl.search);
    return redirectWithCookies(response, request, loginPath);
  }

  return response;
}

function redirectWithCookies(response: NextResponse, request: NextRequest, pathname: string) {
  const redirectResponse = NextResponse.redirect(new URL(pathname, request.url));

  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}
