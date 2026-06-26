import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh', 'id'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|admin|_next|_vercel|images|.*\..*).*)'],
};
