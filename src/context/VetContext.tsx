// src/context/VetContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getFetch } from "@/app/api";
import type { VeterinarianType } from "@/types/index";
import { useSessionContext } from "./SessionProvider";
import { useRoleContext } from "./RoleProvider";
//import { useUI } from "./UIProvider";
import { useStorageContext } from "./StorageProvider";

interface VetContextType {
    vet: VeterinarianType | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

// Contexto para proveer datos del veterinario autenticado
export const VetContext = createContext<VetContextType | undefined>(undefined);

interface VetProviderProps {
    children: ReactNode;
}

export function VetProvider({ children }: VetProviderProps) {
    const session = useSessionContext();
    const [vet, setVet] = useState<VeterinarianType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isVetWithSession, isVetWithoutSession } = useRoleContext();
    //const { setShowVetPetCodeModal } = useUI();
    const storage = useStorageContext();

    // Función para obtener datos del veterinario desde API
    const fetchVet = async () => {
        setLoading(true);
        try {
            if (isVetWithSession) {
                if (!session?.db?.user?.id) {
                    setVet(null);
                    return;
                }
                if (!storage.storedVetData.vet_id) {
                    const res = await getFetch(`/api/vet/${session.db?.user.id}`);
                    if (!res.ok) {
                        console.error("Error fetching veterinarian profile");
                        setVet(null);
                    } else {
                        const data: VeterinarianType = await res.json();
                        storage.setStoredVetData(data);
                        setVet(data);
                    }
                }
                else {
                    setVet(storage.storedVetData);
                }
                //TODO: check if we want to open directly the modal to ask for the code.
                /*if (!storage.storedVetAccess.id) {
                    setShowVetPetCodeModal(true);
                }*/
            }
            else if (isVetWithoutSession) {
                setVet({
                    vet_id: '',
                    first_name: storage.storedVetAccess.vet_first_name,
                    first_last_name: storage.storedVetAccess.vet_first_last_name,
                    second_last_name: storage.storedVetAccess.vet_second_last_name,
                    identification: storage.storedVetAccess.identification,
                    email: '',
                    registration: storage.storedVetAccess.professional_registration,
                    clinic_name: storage.storedVetAccess.clinic_name,
                    city: storage.storedVetAccess.city
                })
            }

        } catch (error) {
            console.error(error);
            setVet(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return (
        <VetContext.Provider value={{ vet, loading, refresh: fetchVet }}>
            {children}
        </VetContext.Provider>
    );
}

// Hook para consumir el contexto de veterinario
export function useVetContext(): VetContextType {
    const context = useContext(VetContext);
    if (!context) {
        console.log('entro aqui');
        throw new Error("useVetContext debe usarse dentro de un VetProvider");
    }
    return context;
}