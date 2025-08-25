import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore la gestion de la locale pour toutes les routes API
  if (pathname.startsWith('/api/')) {
    console.log('Skipping middleware for API route:', pathname);
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1];
  const response = NextResponse.next();
  if (locale && !req.cookies.get('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  }

  if (pathname.match(/^\/[a-zA-Z-]+\/(login|register)/)) {
    const cookie = req.cookies.get(SESSION_COOKIE)?.value;
    if (cookie) {
      try {
        await jwtVerify(cookie, new TextEncoder().encode(JWT_SECRET));
        const lang = pathname.split('/')[1] || 'fr';
        return NextResponse.redirect(new URL(`/${lang}`, req.url));
      } catch {}
    }
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next|static|favicon.ico|api).*)'],
};
