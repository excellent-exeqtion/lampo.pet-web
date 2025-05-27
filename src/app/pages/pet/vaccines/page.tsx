// app/vaccines/page.tsx
"use client";
import React from "react";
import { FaSyringe } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function VaccinesPage() {
  const { storageContext } = useAppContext();
  return (
    <PageComponent
      parentId={storageContext.storedPet.id}
      title="Vacunas"
      icon={<FaSyringe />}
      apiUrl={'/api/pet/list/vaccines/'}
      storedList={storageContext.storedVaccineData}
      setStoredList={storageContext.setStoredVaccineData}
      emptyMessage="No hay registro de vacunas."
      mapItemToFields={FieldData.ForVaccines}
    />
  );
}
