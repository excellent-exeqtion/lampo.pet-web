// context/OwnerSessionProvider.tsx
"use client";
import React, { useEffect } from "react";
import { Empty } from "@/data/index";
import { ApiError } from "@/types/lib";
import type { PetType } from "@/types/index";
import { getFetch } from "@/app/api";
import { isOwner } from "@/utils/roles";
import { usePetStorage } from "./PetStorageProvider";
import { useSessionContext } from "./SessionProvider";

export const OwnerSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const session = useSessionContext();
    const storage = usePetStorage();
    const ownerId = session?.db?.user?.id;

    useEffect(() => {
        if (!session || !ownerId) return;

        (async () => {
            if (isOwner(session)) {
                if (storage.storedOwnerPets.length === 0) {
                    const response = await getFetch(`/api/owners/pets/${ownerId}`);
                    if (!response.ok) throw new ApiError(`Fallo al obtener las mascotas del dueño: ${ownerId}`);
                    const data = await response.json();
                    storage.setStoredOwnerPets(data as PetType[]);
                }
            }

            let initialPet = Empty.Pet();
            if (storage.storedOwnerPets.length > 0) initialPet = storage.storedOwnerPets[0];
            if (storage.storedPet.id) initialPet = storage.storedPet;
            if (JSON.stringify(initialPet) !== JSON.stringify(storage.storedPet)) {
                storage.setStoredPet(initialPet);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, ownerId]);

    return <>{children}</>;
};
