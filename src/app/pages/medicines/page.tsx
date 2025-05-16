// app/medicines/page.tsx (server component)
"use client";
import React from "react";
import { medicinesMock } from "@/data/petdata";
import { useAppContext } from "@/app/layout";
import { FaPills } from "react-icons/fa";
import { v4 } from "uuid";
import { Utils } from "@/lib/utils";
import { LibComponents } from "@/lib/components";

export default function MedicinesModule() {

    const { isMobile, selectedPet } = useAppContext();

    const petMedicines = medicinesMock.filter(p => p.pet_id == selectedPet?.pet_id);

    const renderContent = (isMobile: boolean) => {
        if (petMedicines == undefined) {
            return (<LibComponents.Loading />);
        }

        if (petMedicines.length == 0) {
            return (<LibComponents.DataNotFound message="No hay registro de medicamentos." />);
        }

        var formItems: Utils.Form[] = [];

        petMedicines.forEach(medicine => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Medicamento', show: true, value: medicine.name },
                    { label: 'Dosis', show: true, value: medicine.dosage },
                    { label: 'Frecuencia', show: true, value: medicine.frequency }
                ]
            });
        });
        return Utils.renderForm(formItems, isMobile);
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {Utils.renderTitle(<FaPills />, 'Medicinas')}
            {renderContent(isMobile)}
        </main>
    );
}