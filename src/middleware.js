import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'zh', 'id'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for admin and API routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|images|.*\..*).*)'],
};
