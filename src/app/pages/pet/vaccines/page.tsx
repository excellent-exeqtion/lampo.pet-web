// app/vaccines/page.tsx
"use client";
import React from "react";
import { FaSyringe } from "react-icons/fa";
import { Page } from "@/components/index";
import { VaccineRepository } from "@/repos/index";
import { DisplayPage } from '@/types/index';
import { FieldData } from "@/data/index";

export default function VaccinesPage() {
  return (
    <Page
      page={DisplayPage.Vaccines}
      title="Vacunas"
      icon={<FaSyringe />}
      repository={new VaccineRepository()}
      emptyMessage="No hay registro de vacunas."
      mapItemToFields={FieldData.ForVaccines}
    />
  );
}
