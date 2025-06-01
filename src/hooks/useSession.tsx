// src/hooks/useSession.tsx
"use client";
import { useState, useEffect } from "react";
import type { Session as SupabaseSession, AuthChangeEvent } from "@supabase/supabase-js";
import { authClient } from "@/lib/auth";

export function useSession(): {
  session: SupabaseSession | null;
  setSession: (session: SupabaseSession) => Promise<void>;
  isLoading: boolean;
} {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: authSubscription } = authClient.onAuthStateChange(
      (event: AuthChangeEvent, sessionState: SupabaseSession | null) => {
        if (mounted) {
          setSession(sessionState);

          if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
            if (isLoading) {
              setIsLoading(false);
            }
          }
        } else {
          console.log('hooks/useSession: onAuthStateChange FIRED but component unmounted (Full App Context).');
        }
      });

    authClient.getSession().then(currentSession => {
      if (mounted) {
        setSession(prev => JSON.stringify(prev) === JSON.stringify(currentSession) ? prev : currentSession);

        if (isLoading) {
          setIsLoading(false);
        }
      }
    }).catch(error => {
      if (mounted) {
        console.error("hooks/useSession: authClient.getSession() PROMISE REJECTED (Full App Context):", error);
        if (isLoading) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, [isLoading]);

  const setAppSession = async (session: SupabaseSession) =>{
    await authClient.setSession(session);
    setIsLoading(false);
    setSession(session);
  }

  return { session, setSession: setAppSession, isLoading };
}