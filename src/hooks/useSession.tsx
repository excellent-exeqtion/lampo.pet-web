// src/hooks/useSession.tsx
"use client";
import { useState, useEffect } from "react";
import { authClient, AuthSession } from "@/lib/auth";

export function useSession(): {
  session: AuthSession | null;
  setSession: (session: AuthSession) => Promise<void>;
  isLoading: boolean;
} {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: authSubscription } = authClient.onAuthStateChange(
      (event: string, sessionState: AuthSession | null) => {
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

  const setAppSession = async (session: AuthSession) => {
    await authClient.setSession(session);
    setIsLoading(false);
    setSession(session);
  }

  return { session, setSession: setAppSession, isLoading };
}