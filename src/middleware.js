import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

const locales = ['en', 'zh', 'id'];
const defaultLocale = 'en';

// Create the i18n middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin and API routes: skip entirely, no i18n processing
  if (pathname === '/admin' || pathname.startsWith('/admin/') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|_vercel|images|.*\\..*).*)'],
};
