import { getFetch } from "@/app/api";
import { useRoleContext } from "@/context/RoleProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useUI } from "@/context/UIProvider";
import { ApiError } from "@/types/lib";
import { useEffect, useState } from "react";
import { Empty } from "../data";
import { PetType } from "../types";
import { useSessionContext } from "@/context/SessionProvider";
import { usePlanContext } from "@/context/PlanProvider";

export function useOwnerSession(): { isLoading: boolean } {
    const { db: session } = useSessionContext();
    const storage = useStorageContext();
    const { setShowAddPetModal } = useUI();
    const { isOwner } = useRoleContext();
    const { hasSelectedPlan } = usePlanContext();

    const [loadingOwnerPets, setLoadingOwnerPets] = useState(true);
    const [loadingSelectedPet, setLoadingSelectedPet] = useState(true);

    useEffect(() => {
        const ownerId = session?.user?.id;
        if (!session || !ownerId) return;

        (async () => {
            if (isOwner) {
                if (storage.storedOwnerPets.length === 0) {
                    const response = await getFetch(`/api/owners/pets/${ownerId}`);
                    if (!response.ok) throw new ApiError(`Fallo al obtener las mascotas del dueño: ${ownerId}`);
                    const data = await response.json();
                    storage.setStoredOwnerPets(data as PetType[]);
                }
            }
            setLoadingOwnerPets(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, session?.user?.id]);

    useEffect(() => {
        let initialPet = Empty.Pet();
        if (storage.storedOwnerPets.length > 0) initialPet = storage.storedOwnerPets[0];
        if (storage.storedPet.id) initialPet = storage.storedPet;
        if (JSON.stringify(initialPet) !== JSON.stringify(storage.storedPet)) {
            storage.setStoredPet(initialPet);
        }
        if (!initialPet.id && isOwner && hasSelectedPlan) {
            setShowAddPetModal(true);
        }
        setLoadingSelectedPet(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage.storedOwnerPets]);

    return { isLoading: loadingOwnerPets || loadingSelectedPet }
}