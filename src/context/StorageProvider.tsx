// src/context/StorageProvider.tsx
"use client";
import { useAppStorage } from "@/hooks/useAppStorage";
import { createContext, useContext } from "react";

export const Storage = createContext({} as ReturnType<typeof useAppStorage>);
export const useStorageContext = () => useContext(Storage);

export function StorageProvider({ children }: { children: React.ReactNode }) {
    const storage = useAppStorage();
    return <Storage.Provider value={storage}>{children}</Storage.Provider>;
}