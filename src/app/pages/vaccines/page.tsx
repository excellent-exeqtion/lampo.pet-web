// app/vaccines/page.tsx (server component)
"use client";
import React from "react";
import { vaccinesMock } from "../../../data/petdata";
import { useAppContext } from "@/app/layout";
import { FaSyringe } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DataNotFound, Form, Loading, Title } from "@/components/index";
import { FormType } from "@/types/lib";
import { Dates } from "@/utils/index";

export default function VaccinesPage() {
  useRequireAuth();

  const { isMobile, selectedPet } = useAppContext();

  const petVaccines = vaccinesMock.filter(p => p.pet_id == selectedPet?.id);

  const renderContent = (isMobile: boolean) => {
    if (petVaccines == undefined) {
      return (<Loading />);
    }

    if (petVaccines.length == 0) {
      return (<DataNotFound message="No hay registro de vacunas." />);
    }

    const formItems: FormType[] = [];

    petVaccines.forEach(vaccine => {
      formItems.push({
        id: v4(),
        fields: [
          { label: 'Vacuna', show: true, value: vaccine.name },
          { label: 'Description', show: vaccine.description != null, value: vaccine.description },
          { label: 'Fecha', show: vaccine.date != null, value: Dates.format(vaccine.date) },
          { label: 'Lote', show: true, value: vaccine.batch },
          { label: 'Marca', show: true, value: vaccine.brand }
        ]
      });
    });
    return <Form formItems={formItems} isMobile={isMobile} />;
  };

  return (
    <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
      {<Title icon={ <FaSyringe />} title="Vacunas" />}
      {renderContent(isMobile)}
    </main>
  );
}