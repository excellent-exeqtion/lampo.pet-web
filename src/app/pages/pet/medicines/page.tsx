// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaPills } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { usePetStorage } from "@/context/PetStorageProvider";

export default function MedicinesPage() {
    const storage = usePetStorage();
    return (
        <PageComponent
            parentId={storage.storedPet.id}
            title="Medicinas"
            icon={<FaPills />}
            apiUrl={'/api/pet/list/medicines/'}
            storedList={storage.storedMedicineData}
            setStoredList={storage.setStoredMedicineData}
            emptyMessage="No hay registro de medicamentos."
            mapItemToFields={FieldData.ForMedicines}
        />
    );
}
