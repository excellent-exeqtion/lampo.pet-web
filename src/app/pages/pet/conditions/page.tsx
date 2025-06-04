// app/pages/pet/conditions/page.tsx
"use client";
import React from "react";
import { FaCloudSun } from "react-icons/fa";
import { Page } from "@/components/index";
import { FieldData } from "@/data/index";
import { useStorageContext } from "@/context/StorageProvider";

export default function ConditionsPage() {
    const storage = useStorageContext();
    return (
        <Page
            parentId={storage.storedPet.id}
            title="Condiciones especiales"
            icon={<FaCloudSun />}
            apiUrl={'/api/pets/list/conditions/'}
            storedList={storage.storedConditionData}
            setStoredList={storage.setStoredConditionData}
            emptyMessage="No hay registro de condiciones especiales."
            mapItemToFields={FieldData.ForConditions}
        />
    );
}
