// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaCut } from "react-icons/fa";
import { Page } from "@/components/index";
import { SurgeryRepository } from "@/repos/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function SurgeriesPage() {
    const { storageContext } = useAppContext();
    return (
        <Page
            title="Cirugías"
            icon={<FaCut />}
            repository={new SurgeryRepository()}
            storedList={storageContext.storedSurgeryData}
            setStoredList={storageContext.setStoredSurgeryData}
            emptyMessage="No hay registro de cirugías."
            mapItemToFields={FieldData.ForSurgeries}
        />
    );
}