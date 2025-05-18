// app/lab-tests/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaFlask } from "react-icons/fa";
import { v4 } from "uuid";
import { Dates } from "@/utils/index";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, DataNotFound, Form, Title } from "@/components/index";
import { FormType } from "@/types/lib";
import { LabTestDataType } from "@/types/index";
import { LabTestRepository } from "@/repos/labTest.repository";

export default function LabTestsPage() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();
    const [petLabTests, setPetLabTests] = useState<LabTestDataType[] | null>(null);

    useEffect(() => {
        if (!selectedPet?.id) return;         // don't run if no pet selected

        const fetchData = async () => {
            try {
                const labTest = await LabTestRepository.findByPet(selectedPet.id);
                setPetLabTests(labTest);

            } catch (err) {
                console.error("Error loading lab. tests:", err);
                // you might set an error state here
            }
        };

        fetchData();
    }, [selectedPet?.id]);

    const renderContent = (isMobile: boolean) => {
        if (petLabTests == undefined) {
            return (<Loading />);
        }

        if (petLabTests.length == 0) {
            return (<DataNotFound message="No hay registro de resultados de laboratorio." />);
        }

        const formItems: FormType[] = [];

        petLabTests.forEach(labTest => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Prueba', show: true, value: labTest.name },
                    { label: 'Tipo', show: true, value: labTest.type },
                    { label: 'Fecha', show: labTest.date != null, value: Dates.format(labTest.date) },
                    { label: 'Resultado', show: labTest.result != null, value: labTest.result }
                ]
            });
        });
        return <Form formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaFlask />} title="Exámenes de laboratorio" />}
            {renderContent(isMobile)}
        </main>
    );
}