// app/lab-tests/page.tsx
"use client";
import React from "react";
import { FaFlask } from "react-icons/fa";
import { Page } from "@/components/index";
import { LabTestRepository } from "@/repos/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function LabTestsPage() {
    const {storageContext} = useAppContext();
    return (
        <Page
            title="Exámenes de laboratorio"
            icon={<FaFlask />}
            repository={new LabTestRepository()}
            storedList={storageContext.storedLabTestData}
            setStoredList={storageContext.setStoredLabTestData}
            emptyMessage="No hay registro de resultados de laboratorio."
            mapItemToFields={FieldData.ForLabTests}
        />
    );
}
