// app/vaccines/page.tsx (server component)
"use client";
import React from "react";
import { vaccinesMock } from "@/data/petdata";
import { useAppContext } from "@/app/layout";
import { FaSyringe } from "react-icons/fa";
import { Utils } from "@/lib/utils";
import { v4 } from "uuid";
import { LibComponents } from "@/lib/components";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function VaccinesModule() {
  useRequireAuth();

  const { isMobile, selectedPet } = useAppContext();

  const petVaccines = vaccinesMock.filter(p => p.pet_id == selectedPet?.pet_id);

  const renderContent = (isMobile: boolean) => {
    if (petVaccines == undefined) {
      return (<LibComponents.Loading />);
    }

    if (petVaccines.length == 0) {
      return (<LibComponents.DataNotFound message="No hay registro de vacunas." />);
    }

    const formItems: Utils.Form[] = [];

    petVaccines.forEach(vaccine => {
      formItems.push({
        id: v4(),
        fields: [
          { label: 'Vacuna', show: true, value: vaccine.name },
          { label: 'Description', show: vaccine.description != null, value: vaccine.description },
          { label: 'Fecha', show: vaccine.date != null, value: Utils.formatDate(vaccine.date) },
          { label: 'Lote', show: true, value: vaccine.batch },
          { label: 'Marca', show: true, value: vaccine.brand }
        ]
      });
    });
    return Utils.renderForm(formItems, isMobile);
  };

  return (
    <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
      {Utils.renderTitle(<FaSyringe />, 'Vacunas')}
      {renderContent(isMobile)}
    </main>
  );
}