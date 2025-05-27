// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaCut } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function SurgeriesPage() {
    const { storageContext } = useAppContext();
    return (
        <PageComponent
            parentId={storageContext.storedPet.id}
            title="Cirugías"
            icon={<FaCut />}
            apiUrl={'/api/pet/list/surgeries/'}
            storedList={storageContext.storedSurgeryData}
            setStoredList={storageContext.setStoredSurgeryData}
            emptyMessage="No hay registro de cirugías."
            mapItemToFields={FieldData.ForSurgeries}
        />
    );
}