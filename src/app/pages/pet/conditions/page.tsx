// app/conditions/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaCloudSun } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, DataNotFound, Title, Display } from "@/components/index";
import { FormType } from "@/types/lib";
import { ConditionRepository } from "@/repos/index";
import { ConditionDataType } from "@/types/index";

export default function ConditionsPage() {
    useRequireAuth();

    const { isMobile, selectedPet, showEditPetModal } = useAppContext();
    const [petConditions, setPetConditions] = useState<ConditionDataType[] | null>(null);

    useEffect(() => {
        if (!selectedPet.id) return;         // don't run if no pet selected

        const fetchData = async () => {
            try {
                const conditions = await new ConditionRepository().findByParentId(selectedPet.id);
                setPetConditions(conditions);

            } catch (err) {
                console.error("Error loading conditions:", err);
                // you might set an error state here
            }
        };

        fetchData();
    }, [selectedPet.id, showEditPetModal]);

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
        return <Display formItems={formItems} isMobile={isMobile} />;
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {<Title icon={<FaCloudSun />} title="Condiciones especiales" />}
            {renderContent(isMobile)}
        </main>
    );
}