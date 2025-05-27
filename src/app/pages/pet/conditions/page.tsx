// app/conditions/page.tsx
"use client";
import React from "react";
import { FaCloudSun } from "react-icons/fa";
import { Page } from "@/components/index";
import { ConditionRepository } from "@/repos/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function ConditionsPage() {
    const { storageContext } = useAppContext();
    return (
        <Page
            title="Condiciones especiales"
            icon={<FaCloudSun />}
            repository={new ConditionRepository()}
            storedList={storageContext.storedConditionData}
            setStoredList={storageContext.setStoredConditionData}
            emptyMessage="No hay registro de condiciones especiales."
            mapItemToFields={FieldData.ForConditions}
        />
    );
}
