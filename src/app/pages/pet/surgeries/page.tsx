// app/surgeries/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaCut } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DataNotFound, Display, Loading, Title } from "@/components/index";
import { Dates } from "@/utils/index";
import { FormType } from "@/types/lib";
import { SurgeryRepository } from "@/repos/index";
import { SurgeryDataType } from "@/types/index";

export default function SurgeriesPage() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();
    const [petSurgeries, setPetSurgeries] = useState<SurgeryDataType[] | null>(null);

    useEffect(() => {
        if (!selectedPet.id) return;         // don't run if no pet selected

        const fetchData = async () => {
            try {
                const surgeries = await new SurgeryRepository().findByParentId(selectedPet.id);
                setPetSurgeries(surgeries);

            } catch (err) {
                console.error("Error loading medicines:", err);
                // you might set an error state here
            }
        };

        fetchData();
    }, [selectedPet.id]);

    const renderContent = (isMobile: boolean) => {
        if (petSurgeries == undefined) {
            return (<Loading />);
        }

        if (petSurgeries.length == 0) {
            return (<DataNotFound message="No hay registro de cirugías." />);
        }

        const formItems: FormType[] = [];

        petSurgeries.forEach(surgery => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Procedimiento', show: true, value: surgery.name },
                    { label: 'Fecha', show: surgery.date != null, value: Dates.format(surgery.date) },
                    { label: 'Notas', show: surgery.description != null, value: surgery.description }
                ]
            });
        });
        return <Display formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaCut />} title="Cirugías" />}
            {renderContent(isMobile)}
        </main>
    );
}