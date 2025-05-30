// app/pages/pet/surgeries/page.tsx
"use client";
import React from "react";
import { FaPills } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useStorageContext } from "@/context/StorageProvider";

export default function MedicinesPage() {
    const storage = useStorageContext();
    return (
        <PageComponent
            parentId={storage.storedPet.id}
            title="Medicinas"
            icon={<FaPills />}
            apiUrl={'/api/pets/list/medicines/'}
            storedList={storage.storedMedicineData}
            setStoredList={storage.setStoredMedicineData}
            emptyMessage="No hay registro de medicamentos."
            mapItemToFields={FieldData.ForMedicines}
        />
    );
}
