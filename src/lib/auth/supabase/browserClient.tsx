// lib/auth/supabase/browserClient.ts
import { createBrowserClient as SupabaseCreateBrowserClient } from '@supabase/ssr';

export function createBrowserClient() {
  return SupabaseCreateBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { // Añadir opciones explícitas
      auth: {
        persistSession: true, // Forzar la persistencia, aunque es el default
        autoRefreshToken: true, // Default, bueno tenerlo explícito
        // detectSessionInUrl: true, // Default, para manejar tokens en hash de URL
      }
    }
  );
}