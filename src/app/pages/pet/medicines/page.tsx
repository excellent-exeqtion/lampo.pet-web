// app/medicines/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaPills } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, DataNotFound, Form, Title } from "@/components/index";
import { FormType } from "@/types/lib";
import { MedicineDataType } from "@/types/index";
import { MedicineRepository } from "@/repos/medicine.repository";

export default function MedicinesPage() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();
        const [petMedicines, setPetMedicines] = useState<MedicineDataType[] | null>(null);
    
        useEffect(() => {
            if (!selectedPet?.id) return;         // don't run if no pet selected
    
            const fetchData = async () => {
                try {
                    const medicines = await MedicineRepository.findByPet(selectedPet.id);
                    setPetMedicines(medicines);
    
                } catch (err) {
                    console.error("Error loading medicines:", err);
                    // you might set an error state here
                }
            };
    
            fetchData();
        }, [selectedPet?.id]);

    const renderContent = (isMobile: boolean) => {
        if (petMedicines == undefined) {
            return (<Loading />);
        }

        if (petMedicines.length == 0) {
            return (<DataNotFound message="No hay registro de medicamentos." />);
        }

        const formItems: FormType[] = [];

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
        return <Form formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaPills />} title="Medicinas" />}
            {renderContent(isMobile)}
        </main>
    );
}