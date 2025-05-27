// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaPills } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function MedicinesPage() {
    const { storageContext } = useAppContext();
    return (
        <PageComponent
            parentId={storageContext.storedPet.id}
            title="Medicinas"
            icon={<FaPills />}
            apiUrl={'/api/pet/list/medicines/'}
            storedList={storageContext.storedMedicineData}
            setStoredList={storageContext.setStoredMedicineData}
            emptyMessage="No hay registro de medicamentos."
            mapItemToFields={FieldData.ForMedicines}
        />
    );
}
