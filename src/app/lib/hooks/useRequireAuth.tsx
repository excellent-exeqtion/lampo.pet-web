// hooks/useRequireAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    // 1) Verifica sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login");
      }
    });

    // 2) Escucha cambios de auth: si no hay sesión, redirige
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
}
