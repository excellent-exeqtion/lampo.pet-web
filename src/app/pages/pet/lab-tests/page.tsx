// app/lab-tests/page.tsx
"use client";
import React from "react";
import { FaFlask } from "react-icons/fa";
import { Page } from "@/components/index";
import { LabTestRepository } from "@/repos/index";
import { DisplayPage } from "@/types/index";
import { FieldData } from "@/data/index";

export default function LabTestsPage() {
    return (
        <Page
            page={DisplayPage.LabTests}
            title="Exámenes de laboratorio"
            icon={<FaFlask />}
            repository={new LabTestRepository()}
            emptyMessage="No hay registro de resultados de laboratorio."
            mapItemToFields={FieldData.ForLabTests}
        />
    );
}
