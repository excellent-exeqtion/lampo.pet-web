// src/context/RoleProvider.tsx
"use client";
import { useRole } from "@/hooks/useRole";
import { createContext, useContext } from "react";

export const Role = createContext({} as ReturnType<typeof useRole>);
export const useRoleContext = () => useContext(Role);

export function RoleProvider({ children }: { children: React.ReactNode }) {
    const storage = useRole();
    return <Role.Provider value={storage}>{children}</Role.Provider>;
}