// app/pages/pet/lab-tests/page.tsx
"use client";
import React from "react";
import { FaFlask } from "react-icons/fa";
import { Page } from "@/components/index";
import { FieldData } from "@/data/index";
import { useStorageContext } from "@/context/StorageProvider";

export default function LabTestsPage() {
    const storage = useStorageContext();
    return (
        <Page
            parentId={storage.storedPet.id}
            title="Exámenes de laboratorio"
            icon={<FaFlask />}
            apiUrl={'/api/pets/list/lab-tests/'}
            storedList={storage.storedLabTestData}
            setStoredList={storage.setStoredLabTestData}
            emptyMessage="No hay registro de resultados de laboratorio."
            mapItemToFields={FieldData.ForLabTests}
        />
    );
}
