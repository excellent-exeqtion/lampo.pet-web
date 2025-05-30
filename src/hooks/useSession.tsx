// src/hooks/useSession.tsx
"use client";
import { useState, useEffect } from "react";
import type { Session as SupabaseSession } from "@supabase/supabase-js";
import { getSession, onAuthStateChange } from "@/services/authService";

export function useSession(): SupabaseSession | null {
  const [session, setSession] = useState<SupabaseSession | null>(null);

  useEffect(() => {
    // Inicializa con la sesión actual
    getSession().then(setSession);

    // Envuelve `setSession` para ignorar el primer parámetro (event)
    const sub = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => sub.unsubscribe();
  }, []);

  return session;
}
