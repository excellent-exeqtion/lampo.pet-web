// middleware.ts
import { type NextRequest } from 'next/server';
import { updateSession } from './lib/auth'; // O la ruta correcta a tu index.ts de lib/auth

export async function middleware(request: NextRequest) {
  // updateSession se encargará de refrescar la cookie de sesión de Supabase
  // y también puede manejar redirecciones si no hay usuario (como lo tienes configurado)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};