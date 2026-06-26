import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.redirect(new URL('/api/admin-login', 'https://novalinkchina.com'));
  res.cookies.set('nlc_admin', '', { maxAge: 0, path: '/' });
  return res;
}
