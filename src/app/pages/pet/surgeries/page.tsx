// app/surgeries/page.tsx
"use client";
import React from "react";
import { FaCut } from "react-icons/fa";
import { Page } from "@/components/index";
import { SurgeryRepository } from "@/repos/index";
import { DisplayPage } from "@/types/index";
import { FieldData } from "@/data/index";

export default function SurgeriesPage() {
    return (
        <Page
            page={DisplayPage.Surgeries}
            title="Cirugías"
            icon={<FaCut />}
            repository={new SurgeryRepository()}
            emptyMessage="No hay registro de cirugías."
            mapItemToFields={FieldData.ForSurgeries}
        />
    );
}
