// app/lab-tests/page.tsx
"use client";
import React from "react";
import { FaFlask } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function LabTestsPage() {
    const {storageContext} = useAppContext();
    return (
        <PageComponent
            parentId={storageContext.storedPet.id}
            title="Exámenes de laboratorio"
            icon={<FaFlask />}
            apiUrl={'/api/pet/list/lab-tests/'}
            storedList={storageContext.storedLabTestData}
            setStoredList={storageContext.setStoredLabTestData}
            emptyMessage="No hay registro de resultados de laboratorio."
            mapItemToFields={FieldData.ForLabTests}
        />
    );
}
