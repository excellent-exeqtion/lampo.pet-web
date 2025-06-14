// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
// Cambiamos la ruta de importación a nuestro nuevo archivo seguro para el servidor
import { createServerClient, updateSession } from '@/lib/auth/server';
import { cookies } from 'next/headers';

// Lista de rutas permitidas para veterinarios con acceso temporal
const VET_GUEST_ALLOWED_PATHS = [
    '/pages/pet/basic-data',
    '/pages/pet/vaccines',
    '/pages/pet/surgeries',
    '/pages/pet/medicines',
    '/pages/pet/conditions',
    '/pages/pet/lab-tests',
];

// Helper para validar si la ruta actual está permitida
function isVetGuestAllowedPath(pathname: string, petIdFromCookie: string): boolean {
    // 1. Revisa las rutas estáticas
    if (VET_GUEST_ALLOWED_PATHS.includes(pathname)) {
        return true;
    }
    // 2. Revisa las rutas dinámicas, como la de consultas
    const consultationMatch = pathname.match(/^\/pages\/pet\/consultations\/([^/]+)/);
    if (consultationMatch) {
        const petIdFromUrl = consultationMatch[1];
        // Comprueba si el ID de mascota en la URL coincide con el de la cookie
        return petIdFromUrl === petIdFromCookie;
    }

    // 3. Revisa la ruta para añadir una nueva consulta
    const newConsultationMatch = pathname.match(/^\/pages\/vet\/consultation\/([^/]+)/);
    if (newConsultationMatch) {
        const petIdFromUrl = newConsultationMatch[1];
        return petIdFromUrl === petIdFromCookie;
    }

    return false;
}


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();

    // Rutas públicas que no necesitan validación de sesión ni de cookie
    const publicRoutes = ['/login', '/vet-access', '/pages/auth/verify', '/api/auth/logout'];
    if (pathname === '/' || publicRoutes.some(route => pathname.startsWith(route))) {
        return await updateSession(request);
    }

    const supabaseResponse = NextResponse.next({ request });
    const supabase = await createServerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    // Si hay un usuario con sesión, la lógica de Supabase se encargará
    if (user) {
        return supabaseResponse;
    }

    // Si NO hay usuario, revisamos la cookie de acceso temporal de veterinario
    const vetAccessCookie = request.cookies.get('lampo-vet-access');
    if (vetAccessCookie) {
        try {
            const { petId } = JSON.parse(vetAccessCookie.value);
            if (petId && isVetGuestAllowedPath(pathname, petId)) {
                // El veterinario sin sesión tiene acceso a esta ruta
                return supabaseResponse;
            }
        } catch (error) {
            // La cookie está malformada, la ignoramos y procedemos a redirigir
            console.error("Error parsing vet access cookie:", error);
        }
    }

    // Si no hay usuario y no hay acceso de veterinario válido para esta ruta, redirigimos al login
    // Excluimos las API routes de esta redirección para no romper la app
    if (!pathname.startsWith('/api/')) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // Para todas las demás rutas (principalmente API), dejamos que Supabase maneje la sesión
    return supabaseResponse;
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