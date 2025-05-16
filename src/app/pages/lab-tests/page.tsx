// app/lab-tests/page.tsx (server component)
"use client";
import React from "react";
import { labTestsMock } from "@/data/petdata";
import { useAppContext } from "@/app/layout";
import { FaFlask } from "react-icons/fa";
import { v4 } from "uuid";
import { LibComponents } from "@/lib/components";
import { Utils } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function LabTestsModule() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();

    const petLabTests = labTestsMock.filter(p => p.pet_id == selectedPet?.pet_id);

    const renderContent = (isMobile: boolean) => {
        if (petLabTests == undefined) {
            return (<LibComponents.Loading />);
        }

        if (petLabTests.length == 0) {
            return (<LibComponents.DataNotFound message="No hay registro de resultados de laboratorio." />);
        }

        const formItems: Utils.Form[] = [];

        petLabTests.forEach(labTest => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Prueba', show: true, value: labTest.name },
                    { label: 'Tipo', show: true, value: labTest.type },
                    { label: 'Fecha', show: labTest.date != null, value: Utils.formatDate(labTest.date) },
                    { label: 'Resultado', show: labTest.result != null, value: labTest.result }
                ]
            });
        });
        return Utils.renderForm(formItems, isMobile);
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {Utils.renderTitle(<FaFlask />, 'Lab. de exámenes')}
            {renderContent(isMobile)}
        </main>
    );
}