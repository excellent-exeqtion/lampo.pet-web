// app/pages/pet/vaccines/page.tsx
"use client";
import React from "react";
import { FaSyringe } from "react-icons/fa";
import { PageComponent } from "@/components/index";
import { FieldData } from "@/data/index";
import { useStorageContext } from "@/context/StorageProvider";

export default function VaccinesPage() {
  const storage = useStorageContext();
  return (
    <PageComponent
      parentId={storage.storedPet.id}
      title="Vacunas"
      icon={<FaSyringe />}
      apiUrl={'/api/pets/list/vaccines/'}
      storedList={storage.storedVaccineData}
      setStoredList={storage.setStoredVaccineData}
      emptyMessage="No hay registro de vacunas."
      mapItemToFields={FieldData.ForVaccines}
    />
  );
}
