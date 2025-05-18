// app/basic-data/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaUser } from "react-icons/fa";
import { format } from "@/utils/dates";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { BasicField, Loading, Title } from "@/components/index";
import { FieldType } from "@/types/lib";
import { BasicDataRepository } from "@/repos/basicData.repository";
import { BasicDataType, OwnerDataType } from "@/types/index";
import { OwnerRepository } from "@/repos/owner.repository";
import { v4 } from 'uuid';

export default function BasicDataPage() {
  useRequireAuth();

  const { isMobile, selectedPet } = useAppContext();
  const [petData, setPetData] = useState<BasicDataType | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerDataType | null>(null);

useEffect(() => {
  if (!selectedPet?.id) return;

  const fetchData = async () => {
    try {
      const basicData = await BasicDataRepository.findByPetId(selectedPet.id);
      setPetData(basicData);
      const owner = await OwnerRepository.findById(selectedPet.owner_id);
      setOwnerData(owner);
    } catch (err) {
      console.error("Error cargando datos básicos o dueño:", err);
    }
  };

  fetchData();
}, [selectedPet?.id, selectedPet?.owner_id]); 


  if (petData === null || ownerData === null) {
    return (<Loading />)
  }

  const basicDataItems: FieldType[] = [
    { label: "Tipo de mascota", show: true, value: petData.pet_type },
    { label: "Género", show: true, value: petData.gender },
    { label: "Peso", show: true, value: petData.weight },
    { label: "Raza", show: true, value: petData.race },
    { label: "Alergias", show: true, value: petData.has_allergies ? 'Si' : 'No' },
    { label: "Condición de peso", show: true, value: petData.weight_condition },
    { label: "Tamaño", show: true, value: petData.size },
    { label: "Vive con otros", show: true, value: petData.lives_with_others ? 'Si' : 'No' },
    { label: "Comida principal", show: true, value: petData.main_food },
    { label: "Última vacuna", show: true, value: petData.has_vaccine ? (`${petData.last_vaccine_name} (${format(petData.last_vaccine_date)})`) : 'No tiene vacunas' },
    { label: "Castrado", show: true, value: petData.is_castrated ? (`Sí (${format(petData.castration_date)})`) : 'No' },
    { label: "Antipulgas", show: true, value: petData.has_anti_flea ? (`Sí (${format(petData.anti_flea_date)})`) : 'No' },
    { label: "¿Usa medicina?", show: true, value: petData.uses_medicine ? 'Si' : 'No' },
    { label: "Condición especial", show: true, value: petData.special_condition ? 'Si' : 'No' },
  ];


  const contactItems: FieldType[] = [
    { label: "Nombre del contacto", show: true, value: ownerData?.name },
    { label: "Teléfono", show: ownerData?.phone != null, value: ownerData?.phone },
    { label: "Dirección", show: ownerData?.address != null, value: ownerData?.address },
    { label: "Ciudad", show: true, value: ownerData?.city },
    { label: "País", show: true, value: ownerData?.country },
    { label: "Email", show: true, value: ownerData?.email },
  ];

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      {/* Datos básicos en tres columnas */}
      <section style={{ marginBottom: "2rem" }}>
        {<Title icon={<FaUser />} title="Datos básicos" />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {basicDataItems.map((item) =>
            <BasicField key={v4()} item={item} />
          )}
        </div>
      </section>
      <section>
        {<Title icon={<FaUser />} title="Datos de contacto" />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {contactItems.map((item) => 
            <BasicField key={v4()} item={item} />
          )}
        </div>
      </section>
    </main>
  );
}

