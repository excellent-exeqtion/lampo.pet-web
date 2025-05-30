// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
    // Clonar la respuesta para poder modificar sus cookies
    // NextResponse.next() crea una nueva respuesta basada en la solicitud
    const response = NextResponse.next({
        request: {
            headers: req.headers, // Asegúrate de pasar los headers de la solicitud
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // Para la cadena de middleware y Route Handlers subsecuentes,
                    // modificamos las cookies de la solicitud 'req'.
                    // Para la respuesta final al cliente, modificamos 'response.cookies'.
                    req.cookies.set({ name, value, ...options });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // Para eliminar, establece el valor a vacío y usa las opciones para expirar.
                    // O usa el método delete si está disponible y es más semántico.
                    req.cookies.set({ name, value: '', ...options }); // O req.cookies.delete(name, options) si la API lo permite para las opciones.
                    response.cookies.set({ name, value: '', ...options }); // O response.cookies.delete(name, options)
                },
            },
        }
    );

    // Es importante obtener la sesión DESPUÉS de haber creado el cliente Supabase
    // con el adaptador de cookies, ya que getSession puede necesitar refrescar el token
    // y, por lo tanto, usar los métodos set/remove del adaptador.
    const { data: { session } } = await supabase.auth.getSession();

    // Lógica de protección de rutas
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/', req.url)); // Redirigir si ya hay sesión y está en login/register
    }


    // Si Supabase actualizó la sesión (ej. refresh de token),
    // las funciones `set` o `remove` del adaptador de cookies habrán sido llamadas,
    // actualizando `response.cookies`. Devolvemos esa `response` modificada.
    return response;
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
        '/((?!_next/static|_next/image|favicon.ico|logo.png|images/).*)',
    ],
};