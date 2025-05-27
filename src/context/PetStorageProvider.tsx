// src/context/PetStorageProvider.tsx
"use client";
import { useAppStorage } from "@/hooks/useAppStorage";
import { createContext, useContext } from "react";


export const Petstorage = createContext({} as ReturnType<typeof useAppStorage>);
export const usePetStorage = () => useContext(Petstorage);

export function PetStorageProvider({ children }: { children: React.ReactNode }) {
    const storage = useAppStorage();
    return <Petstorage.Provider value={storage}>{children}</Petstorage.Provider>;
}