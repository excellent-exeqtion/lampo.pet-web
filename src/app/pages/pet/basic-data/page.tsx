// app/pages/pet/basic-data/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { format } from "@/utils/dates";
import { BasicField, Loading, Title } from "@/components/index";
import { FieldType } from "@/types/lib";
import { BasicDataType, OwnerDataType } from "@/types/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { getFetch } from "@/app/api";
import { useSession } from "@/hooks/useSession";
import { useStorageContext } from "@/context/StorageProvider";

export default function BasicDataPage() {
  useSession();

  const { isMobile } = useDeviceDetect();
  const storage = useStorageContext();
  const [petData, setPetData] = useState<BasicDataType | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerDataType | null>(null);
  const [basicDataItems, setBasicDataItems] = useState<FieldType[]>([]);
  const [contactItems, setContactItems] = useState<FieldType[]>([]);

  useEffect(() => {
    const petId = storage.storedPet.id;
    if (!petId || storage.storedBasicData.pet_id) {
      setPetData(storage.storedBasicData);
      return;
    }

    const fetchData = async () => {
      try {
        // 1) Datos básicos de la mascota
        const resPet = await getFetch(`/api/pets/basic-data/${storage.storedPet.id}`);
        if (!resPet.ok) throw new Error("Falló fetch basic-data");
        const basicData: BasicDataType = await resPet.json();
        storage.setStoredBasicData(basicData);
        setPetData(basicData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage.storedBasicData]);


  useEffect(() => {
    const ownerId = storage.storedPet.owner_id;
    if (!ownerId || storage.storedOwnerData.owner_id) {
      setOwnerData(storage.storedOwnerData);
      return;
    }
    const fetchData = async () => {
      try {
        const resOwner = await getFetch(`/api/owners/${storage.storedPet.owner_id}`);
        if (!resOwner.ok) throw new Error("Falló fetch owners");
        const owner: OwnerDataType = await resOwner.json();
        storage.setStoredOwnerData(owner);
        setOwnerData(owner);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage.storedOwnerData]);

  useEffect(() => {
    if (!petData) return;
    setBasicDataItems([
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
    ]);
  }, [petData]);


  useEffect(() => {
    if (!ownerData) return;
    setContactItems([
      { label: "Nombre del contacto", show: true, value: ownerData.name },
      { label: "Teléfono", show: ownerData.phone != null, value: ownerData.phone },
      { label: "Dirección", show: ownerData.address != null, value: ownerData.address },
      { label: "Ciudad", show: true, value: ownerData.city },
      { label: "País", show: true, value: ownerData.country },
      { label: "Email", show: true, value: ownerData.email },
    ]);
  }, [ownerData]);

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      {/* Datos básicos en tres columnas */}
      <section style={{ marginBottom: "2rem" }}>
        {<Title icon={<FaUser />} title="Datos básicos" />}
        {!petData &&
          <Loading />
        }
        {petData &&
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {basicDataItems.map((item) =>
              <BasicField key={item.label} item={item} />
            )}
          </div>
        }
      </section>
      <section>
        {<Title icon={<FaUser />} title="Datos de contacto" />}
        {!ownerData &&
          <Loading />
        }
        {ownerData &&
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {contactItems.map((item) =>
              <BasicField key={item.label} item={item} />
            )}
          </div>
        }
      </section>
    </main>
  );
}

