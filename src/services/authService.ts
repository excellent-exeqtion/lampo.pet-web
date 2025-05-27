// src/services/authService.ts
import { supabase } from "@/lib/client/supabase";
import type { Session, User, AuthError, AuthChangeEvent } from "@supabase/supabase-js";
import { Empty } from "@/data/index";

export const signIn = async (
  email: string,
  password: string
): Promise<{ data: { session: Session | null; user: User | null }; error: AuthError | null }> => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const ownerSignUp = async (
  email: string,
  password: string
): Promise<{ data: { user: User | null }; error: AuthError | null }> => {
  return supabase.auth.signUp({ email, password,
    options: {
    data: { role: "owner" }
  } });
};

export const resetPassword = async (
  email: string
): Promise<{ data: object | null; error: AuthError | null }> => {
  return supabase.auth.resetPasswordForEmail(email);
};
export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  cb: (event: AuthChangeEvent, session: Session | null) => void
) => supabase.auth.onAuthStateChange(cb).data.subscription;

export const setSession = (session: {
  access_token: string;
  refresh_token: string;
}) => supabase.auth.setSession(session);

export const handleLogout = async (storage: StorageContextType) => {
  try {
    const response = await fetch("/api/auth/sign-out", { method: "POST" });
    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Error cerrando sesión:", result.message || "Unknown error");
    }
  } catch (err) {
    console.error("Error en logout:", err);
  }

  storage.setStoredPet(Empty.Pet());
  storage.setStoredOwnerPets([]);
  storage.setStoredVetAccess(Empty.VetAccess());

  window.location.href = "/";
};