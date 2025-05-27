// src/context/SessionProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession as useRawSession } from "@/hooks/useSession";
import { AppSession } from "@/types/lib";

const SessionContext = createContext<AppSession | null>(null);

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const rawSession = useRawSession();
    const [appSession, setAppSession] = useState<AppSession | null>(null);

    useEffect(() => {
        if (rawSession) setAppSession({ db: rawSession });
    }, [rawSession]);

    return (
        <SessionContext.Provider value={appSession}>
            {children}
        </SessionContext.Provider>
    );
}
