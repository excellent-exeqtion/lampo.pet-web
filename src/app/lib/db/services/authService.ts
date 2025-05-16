// app/lib/db/services/authService.ts
import { supabase } from "@/lib/db/supabaseClient";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  cb: (event: AuthChangeEvent, session: Session | null) => void
) => supabase.auth.onAuthStateChange(cb).data.subscription;
