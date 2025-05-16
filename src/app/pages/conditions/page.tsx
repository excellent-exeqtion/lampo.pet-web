// app/conditions/page.tsx (server component)
"use client";
import React from "react";
import { conditionsMock } from "../../../data/petdata";
import { useAppContext } from "@/app/layout";
import { FaCloudSun } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, DataNotFound, Form, Title } from "@/components/index";
import { FormType } from "@/types/lib";

export default function ConditionsPage() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();

    const petConditions = conditionsMock.filter(p => p.pet_id == selectedPet?.id);

    const renderContent = (isMobile: boolean) => {
        if (petConditions == undefined) {
            return (<Loading />);
        }

        if (petConditions.length == 0) {
            return (<DataNotFound message="No hay registro de condiciones especiales." />);
        }

        const formItems: FormType[] = [];

        petConditions.forEach(condition => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Condición', show: true, value: condition.condition },
                    { label: 'Severidad', show: true, value: condition.severity }
                ]
            });
        });
        return <Form formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaCloudSun />} title="Condiciones especiales" />}
            {renderContent(isMobile)}
        </main>
    );
}