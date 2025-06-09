// lib/auth/supabase/serverClient.ts
import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// Cliente Supabase para Server Components, API Routes y Middleware
export async function createServerClient(cookieStore: ReadonlyRequestCookies) {

  return (await supabaseCreateServerClient( // Usa la función importada directamente
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Cuando Supabase llama a esto en una Route Handler,
          // está indicando que una cookie necesita ser establecida en la RESPUESTA.
          // La instancia de `cookieStore` aquí puede ser usada para esto.
          try {
            cookieStore.set(name, value, options); // Correcto para la respuesta
            // O si la API de cookieStore requiere un objeto:
            // cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`SSR Error (Route Handler): Failed to set cookie ${name}`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // Para eliminar, establece el valor a vacío y usa las opciones para expirar.
            cookieStore.set(name, '', options); // Correcto para la respuesta
            // O si la API de cookieStore requiere un objeto:
            // cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error(`SSR Error (Route Handler): Failed to remove cookie ${name}`, error);
          }
        },
      }
    }
  )).auth;
}

export async function getUser(cookieStore: ReadonlyRequestCookies): Promise<User | null> {
  const supabase = await createServerClient(cookieStore);
  const { data: { user } } = await supabase.getUser();
  return user as User;
}