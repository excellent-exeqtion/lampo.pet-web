// app/conditions/page.tsx
"use client";
import React from "react";
import { FaCloudSun } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function ConditionsPage() {
    const { storageContext } = useAppContext();
    return (
        <PageComponent
            parentId={storageContext.storedPet.id}
            title="Condiciones especiales"
            icon={<FaCloudSun />}
            apiUrl={'/api/pet/list/conditions/'}
            storedList={storageContext.storedConditionData}
            setStoredList={storageContext.setStoredConditionData}
            emptyMessage="No hay registro de condiciones especiales."
            mapItemToFields={FieldData.ForConditions}
        />
    );
}
