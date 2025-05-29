// app/pages/pet/lab-tests/page.tsx
"use client";
import React from "react";
import { FaFlask } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { usePetStorage } from "@/context/PetStorageProvider";

export default function LabTestsPage() {
    const storage = usePetStorage();
    return (
        <PageComponent
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
