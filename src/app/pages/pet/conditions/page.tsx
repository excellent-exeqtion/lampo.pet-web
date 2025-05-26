// app/conditions/page.tsx
"use client";
import React from "react";
import { FaCloudSun } from "react-icons/fa";
import { Page } from "@/components/index";
import { ConditionRepository } from "@/repos/index";
import { DisplayPage } from "@/types/index";
import { FieldData } from "@/data/index";

export default function ConditionsPage() {
    return (
        <Page
            page={DisplayPage.Conditions}
            title="Condiciones especiales"
            icon={<FaCloudSun />}
            repository={new ConditionRepository()}
            emptyMessage="No hay registro de condiciones especiales."
            mapItemToFields={FieldData.ForConditions}
        />
    );
}
