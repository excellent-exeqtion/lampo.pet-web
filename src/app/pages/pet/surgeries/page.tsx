// app/pages/pet/surgeries/page.tsx
"use client";
import React from "react";
import { FaCut } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { usePetStorage } from "@/context/PetStorageProvider";

export default function SurgeriesPage() {
    const storage = usePetStorage();
    return (
        <PageComponent
            parentId={storage.storedPet.id}
            title="Cirugías"
            icon={<FaCut />}
            apiUrl={'/api/pets/list/surgeries/'}
            storedList={storage.storedSurgeryData}
            setStoredList={storage.setStoredSurgeryData}
            emptyMessage="No hay registro de cirugías."
            mapItemToFields={FieldData.ForSurgeries}
        />
    );
}