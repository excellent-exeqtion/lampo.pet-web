// src/hooks/useSession.tsx
"use client";
import { useState, useEffect } from "react";
import type { Session as SupabaseSession } from "@supabase/supabase-js";
import { getSession, onAuthStateChange } from "@/services/authService";

export function useSession(): SupabaseSession | null {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [subscription, setSubscription] = useState<{ unsubscribe: () => void; }>({ unsubscribe: () => { } });

  useEffect(() => {
    const fetchSession = async () => {

      // Inicializa con la sesión actual
      const currentSession = await getSession();
      console.log('currentSession', currentSession)
      setSession(currentSession);

      // Envuelve `setSession` para ignorar el primer parámetro (event)
      setSubscription(onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      }));
    }
    fetchSession();
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return session;
}
