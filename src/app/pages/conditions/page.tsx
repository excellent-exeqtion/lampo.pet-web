// app/conditions/page.tsx (server component)
"use client";
import React from "react";
import { conditionsMock } from "@/data/petdata";
import { useAppContext } from "@/app/layout";
import { FaCloudSun } from "react-icons/fa";
import { v4 } from "uuid";
import { Utils } from "@/lib/utils";
import { LibComponents } from "@/lib/components";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function ConditionsModule() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();

    const petConditions = conditionsMock.filter(p => p.pet_id == selectedPet?.pet_id);

    const renderContent = (isMobile: boolean) => {
        if (petConditions == undefined) {
            return (<LibComponents.Loading />);
        }

        if (petConditions.length == 0) {
            return (<LibComponents.DataNotFound message="No hay registro de condiciones especiales." />);
        }

        var formItems: Utils.Form[] = [];

        petConditions.forEach(condition => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Condición', show: true, value: condition.condition },
                    { label: 'Severidad', show: true, value: condition.severity }
                ]
            });
        });
        return Utils.renderForm(formItems, isMobile);
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {Utils.renderTitle(<FaCloudSun />, 'Condiciones especiales')}
            {renderContent(isMobile)}
        </main>
    );
}