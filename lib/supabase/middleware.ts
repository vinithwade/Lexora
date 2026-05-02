import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  // /auth/* (the OAuth callback) MUST run regardless of session state — that
  // is literally the request that creates the session. If we ran getUser()
  // here and redirected on null, we'd throw away the OAuth code in the URL.
  if (pathname.startsWith("/auth")) {
    return supabaseResponse;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isPublic = pathname === "/" || isAuthRoute || pathname.startsWith("/api/cron");

  if (!user && !isPublic) {
    // Preserve any cookies Supabase wrote during getUser() (e.g. a rotated
    // refresh token) on the redirect response, otherwise we'd silently drop
    // them and the next request would lack valid auth state.
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    supabaseResponse.cookies.getAll().forEach(c =>
      redirect.cookies.set(c.name, c.value, c)
    );
    return redirect;
  }

  if (user && isAuthRoute) {
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
    supabaseResponse.cookies.getAll().forEach(c =>
      redirect.cookies.set(c.name, c.value, c)
    );
    return redirect;
  }

  return supabaseResponse;
}
