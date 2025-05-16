// app/basic-data/page.tsx (server component)
"use client";
import React from "react";
import { petsData, ownersData } from "../../../data/petdata";
import { useAppContext } from "@/app/layout";
import { FaUser } from "react-icons/fa";
import { format } from "@/utils/dates";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loading, Title } from "@/components/index";
import { FieldType } from "@/types/lib";

export default function BasicDataPage() {
  useRequireAuth();

  const { isMobile, selectedPet } = useAppContext();

  // Datos básicos y de contacto
  const petData = petsData.filter(p => p.pet_id == selectedPet?.id)[0];

  if (petData == undefined) {
    return (<Loading />)
  }

  const basicDataItems: FieldType[] = [
    { label: "Tipo de mascota", show: true, value: petData.petType },
    { label: "Género", show: true, value: petData.gender },
    { label: "Peso", show: true, value: petData.weight },
    { label: "Raza", show: true, value: petData.race },
    { label: "Alergias", show: true, value: petData.hasAllergies ? 'Si' : 'No' },
    { label: "Condición de peso", show: true, value: petData.weightCondition },
    { label: "Tamaño", show: true, value: petData.size },
    { label: "Vive con otros", show: true, value: petData.livesWithOthers ? 'Si' : 'No' },
    { label: "Comida principal", show: true, value: petData.mainFood },
    { label: "Última vacuna", show: true, value: petData.hasVaccine ? (`${petData.lastVaccineName} (${format(petData.lastVaccineDate)})`) : 'No tiene vacunas' },
    { label: "Castrado", show: true, value: petData.isCastrated ? (`Sí (${format(petData.castrationDate)})`) : 'No' },
    { label: "Antipulgas", show: true, value: petData.hasAntiFlea ? (`Sí (${format(petData.antiFleaDate)})`) : 'No' },
    { label: "¿Usa medicina?", show: true, value: petData.usesMedicine ? 'Si' : 'No' },
    { label: "Condición especial", show: true, value: petData.specialCondition ? 'Si' : 'No' },
  ];

  const ownerData = ownersData.filter(p => p.owner_id == selectedPet?.owner_id)[0];

  const contactItems: FieldType[] = [
    { label: "Nombre del contacto", show: true, value: ownerData.name },
    { label: "Teléfono", show: true, value: ownerData.phone },
    { label: "Dirección", show: true, value: ownerData.address },
    { label: "Ciudad", show: true, value: ownerData.city },
    { label: "País", show: true, value: ownerData.country },
    { label: "Email", show: true, value: ownerData.email },
  ];

  // white box with shadow
  const renderField = (item: FieldType) => {
    if (!item.show) {
      return <div></div>;
    }
    return (
      <div key={item.label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{item.label}</p>
        <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{item.value}</p>
      </div>
    );
  }

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      {/* Datos básicos en tres columnas */}
      <section style={{ marginBottom: "2rem" }}>
        {<Title icon={<FaUser />} title="Datos básicos" />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {basicDataItems.map((item) => renderField(item))}
        </div>
      </section>
      <section>
        {<Title icon={<FaUser />} title="Datos de contacto" />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {contactItems.map((item) => renderField(item))}
        </div>
      </section>
    </main>
  );
}
