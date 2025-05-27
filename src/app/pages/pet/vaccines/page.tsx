// app/vaccines/page.tsx
"use client";
import React from "react";
import { FaSyringe } from "react-icons/fa";
import { Page } from "@/components/index";
import { VaccineRepository } from "@/repos/index";
import { FieldData } from "@/data/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";

export default function VaccinesPage() {
  const { storageContext } = useAppContext();
  return (
    <Page
      title="Vacunas"
      icon={<FaSyringe />}
      repository={new VaccineRepository()}
      storedList={storageContext.storedVaccineData}
      setStoredList={storageContext.setStoredVaccineData}
      emptyMessage="No hay registro de vacunas."
      mapItemToFields={FieldData.ForVaccines}
    />
  );
}
