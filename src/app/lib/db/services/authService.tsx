// lib/authService.tsx
import { supabase } from "@/lib/db/supabaseClient";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export const getSession = async (): Promise<{ data: { session: Session | null } }> =>
  supabase.auth.getSession();

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
  // TS inferirá correctamente el tipo de `subscription`
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return subscription;
};

export const signOut = async (): Promise<{ error: Error | null }> =>
  supabase.auth.signOut();
