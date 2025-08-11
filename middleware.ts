import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_COOKIE = 'session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  return NextResponse.next();
}
