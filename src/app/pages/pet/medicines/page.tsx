// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaPills } from "react-icons/fa";
import { Page } from "@/components/index";
import { MedicineRepository } from "@/repos/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function MedicinesPage() {
    const { storageContext } = useAppContext();
    return (
        <Page
            title="Medicinas"
            icon={<FaPills />}
            repository={new MedicineRepository()}
            storedList={storageContext.storedMedicineData}
            setStoredList={storageContext.setStoredMedicineData}
            emptyMessage="No hay registro de medicamentos."
            mapItemToFields={FieldData.ForMedicines}
        />
    );
}
