// app/surgeries/page.tsx (server component)
"use client";
import React from "react";
import { surgeriesMock } from "@/data/petdata";
import { useAppContext } from "@/app/layout";
import { FaCut } from "react-icons/fa";
import { v4 } from "uuid";
import { Utils } from "@/lib/utils";
import { LibComponents } from "@/lib/components";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function SurgeriesModule() {
    useRequireAuth();

    const { isMobile, selectedPet } = useAppContext();

    const petSurgeries = surgeriesMock.filter(p => p.pet_id == selectedPet?.pet_id);

    const renderContent = (isMobile: boolean) => {
        if (petSurgeries == undefined) {
            return (<LibComponents.Loading />);
        }

        if (petSurgeries.length == 0) {
            return (<LibComponents.DataNotFound message="No hay registro de cirugías."/>);
        }

        var formItems: Utils.Form[] = [];

        petSurgeries.forEach(surgery => {
            formItems.push({
                id: v4(),
                fields: [
                    { label: 'Procedimiento', show: true, value: surgery.name },
                    { label: 'Fecha', show: surgery.date != null, value: Utils.formatDate(surgery.date) },
                    { label: 'Notas', show: surgery.description != null, value: surgery.description }
                ]
            });
        });
        return Utils.renderForm(formItems, isMobile);
    };

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            {Utils.renderTitle(<FaCut />, 'Cirugías')}
            {renderContent(isMobile)}
        </main>
    );
}