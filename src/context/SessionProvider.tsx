// src/context/SessionProvider.tsx
"use client";
import React, { createContext, useContext } from "react";
import { useSession as useAppSessionHook } from "@/hooks/useSession";
import { Session as SupabaseSession } from "@supabase/supabase-js";

interface AppSessionContextType {
    db: SupabaseSession | null;
    isLoading: boolean;
    setSession: (session: SupabaseSession) => Promise<void>;
}

const SessionContext = createContext<AppSessionContextType>({
    db: null,
    isLoading: true,
    setSession: async () => {}
});

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const { session, isLoading, setSession } = useAppSessionHook();
    return (
        <SessionContext.Provider value={{ db: session, isLoading: isLoading, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}