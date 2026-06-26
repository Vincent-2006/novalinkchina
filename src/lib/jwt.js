import { cookies } from 'next/headers';

const SECRET = process.env.ADMIN_SECRET || 'nlc-admin-secret-2026';

export function createToken() {
  const payload = { admin: true, exp: Date.now() + 86400000 };
  // Simple base64 encoded JWT-like token (no external deps)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload.admin && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function setAuthCookie() {
  cookies().set('nlc_admin', createToken(), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/',
    maxAge: 86400
  });
}

export function checkAuth() {
  try {
    const token = cookies().get('nlc_admin')?.value;
    return verifyToken(token);
  } catch {
    return false;
  }
}
