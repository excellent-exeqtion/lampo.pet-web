// lib/auth/supabase/serverClient.ts
import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente Supabase para Server Components, API Routes y Middleware
export async function createServerClient() {
  const cookieStore = await cookies(); // Obtiene la instancia de cookies de Next.js

  return supabaseCreateServerClient( // Usa la función importada directamente
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // El método `get` toma el nombre de la cookie y devuelve su valor o undefined.
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // El método `set` toma el nombre, valor y opciones de la cookie.
        set(name: string, value: string, options: CookieOptions) {
          try {
            // `cookieStore.set` puede tomar un objeto o argumentos separados.
            // La versión más reciente de Next.js prefiere un objeto.
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Esto puede ocurrir si `set` se llama desde un Server Component.
            // Se puede ignorar si tienes un middleware refrescando las sesiones.
            // (Como es tu caso, esta captura está bien).
            console.warn(`ServerClient: Failed to set cookie ${name} from a Server Component context. Error: ${error}`);
          }
        },
        // El método `remove` toma el nombre y opciones de la cookie.
        // Para eliminar una cookie, se suele establecer un valor vacío y una fecha de expiración pasada.
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Similar a `set`, esto puede ocurrir en Server Components.
            console.warn(`ServerClient: Failed to remove cookie ${name} from a Server Component context. Error: ${error}`);
          }
        },
      },
    }
  );
}