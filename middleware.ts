import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('🔍 Middleware called for:', pathname);

  // Ignore la gestion de la locale pour toutes les routes API
  if (pathname.startsWith('/api/')) {
    console.log('✅ Skipping middleware for API route:', pathname);
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1];
  const response = NextResponse.next();
  if (locale && !req.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  }

  // Check if this is login or register page
  const loginRegisterMatch = pathname.match(/^\/[a-zA-Z-]+\/(login|register)$/);
  console.log('🔐 Login/Register match:', loginRegisterMatch ? 'YES' : 'NO', 'for', pathname);

  if (loginRegisterMatch) {
    const cookie = req.cookies.get(SESSION_COOKIE)?.value;
    console.log('🍪 Session cookie exists:', !!cookie);
    if (cookie) {
      try {
        await jwtVerify(cookie, new TextEncoder().encode(JWT_SECRET));
        const lang = pathname.split('/')[1] || 'fr';
        console.log('🔄 Redirecting authenticated user to:', `/${lang}`);
        return NextResponse.redirect(new URL(`/${lang}`, req.url));
      } catch {
        console.log('❌ Invalid session cookie');
      }
    }
  }

  console.log('✅ Middleware allowing:', pathname);
  return response;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api).*)'],
};
