// src/context/OwnerSessionProvider.tsx
"use client";
import React, { createContext, useContext } from "react";
import { useOwnerSession } from "@/hooks/useOwnerSession";

interface OwnerSessionContextType { isLoading: boolean }

const OwnerSessionContext = createContext<OwnerSessionContextType>({
    isLoading: true
});

export const useOwnerSessionContext = () => useContext(OwnerSessionContext);

export function OwnerSessionProvider({ children }: { children: React.ReactNode }) {
    const { isLoading } = useOwnerSession();
    return (
        <OwnerSessionContext.Provider value={{  isLoading }}>
            {children}
        </OwnerSessionContext.Provider>
    );
}