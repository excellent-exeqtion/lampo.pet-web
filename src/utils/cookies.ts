// src/utils/cookies.ts
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export function getAccessTokenFromCookie(cookies: ReadonlyRequestCookies) {
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF;
    const cookieName = `sb-${projectRef}-auth-token`;
    const cookieValue = cookies.get(cookieName)?.value;
    if (!cookieValue) return null;

  // Decodifica base64url a base64
  const base64 = cookieValue.replace("base64-","").replace(/-/g, '+').replace(/_/g, '/')
    + '='.repeat((4 - cookieValue.length % 4) % 4);

  // Ahora decodifica a string y parsea JSON
  const jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
  const json = JSON.parse(jsonStr);
  return json.access_token;  // <-- SOLO ESTA PARTE VA EN EL HEADER
}