// app/surgeries/page.tsx (server component)
"use client";
import React from "react";
import { surgeriesMock } from "../../../data/petdata";
import { useAppContext } from "@/app/layout";
import { FaCut } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DataNotFound, Form, Loading, Title } from "@/components/index";
import { Dates } from "@/utils/index";
import { FormType } from "@/types/lib";

export default function SurgeriesPage() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();

    const petSurgeries = surgeriesMock.filter(p => p.pet_id == selectedPet?.id);

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
        return <Form formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaCut />} title="Cirugías" />}
            {renderContent(isMobile)}
        </main>
    );
}