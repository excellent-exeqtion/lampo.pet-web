// src/context/SessionProvider.tsx
"use client";
import { createContext, useContext } from "react";
import { useSession } from "@/hooks/useSession";
import { AppSession } from "@/types/lib";

const SessionContext = createContext({} as AppSession);

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const session = useSession();
    return (
        <SessionContext.Provider value={{ db: session }}>
            {children}
        </SessionContext.Provider>
    );
}