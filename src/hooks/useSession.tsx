// app/hooks/useSession.tsx
"use client";

import { useState, useEffect } from "react";
import { getSession, onAuthStateChange } from "../services/authService";
import type { Session } from "@supabase/supabase-js";

export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    // 1) Obtenemos sesión inicial
    (async () => {
      const { data } = await getSession();
      setSession(data.session);
    })();

    // 2) Nos suscribimos a cambios
    const subscription = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
}
