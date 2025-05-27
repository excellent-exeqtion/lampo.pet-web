// app/hooks/useSession.tsx
"use client";

import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

export function useSession(): Session | null | undefined {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    const getCurrentSession = async () => {
      const res = await fetch("/api/auth/session");
      const json = await res.json();
      setSession(json.session || null);
    };

    // 1. Obtiene sesión inicial
    getCurrentSession();

    // 2. Escucha cambio de visibilidad de pestaña (útil si el usuario inicia/cierra sesión en otra tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        getCurrentSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);


  return session;
}
