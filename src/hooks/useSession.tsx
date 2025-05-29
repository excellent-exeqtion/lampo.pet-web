// app/hooks/useSession.tsx
"use client";

import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { onAuthStateChange } from "@/services/authService";

export function useSession(): Session | undefined {
  const [session, setSession] = useState<Session | undefined>(undefined);
  useEffect(() => {
    const getCurrentSession = async () => {
      const res = await fetch("/api/auth/session");
      const json = await res.json();
      setSession(json.session || undefined);
    };

    // 1. Obtiene sesión inicial
    getCurrentSession();

    // 2) Nos suscribimos a cambios
    const subscription = onAuthStateChange((_event, newSession) => {
      if (newSession) setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);


  return session;
}
