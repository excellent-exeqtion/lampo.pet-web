// app/vaccines/page.tsx (server component)
"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { FaSyringe } from "react-icons/fa";
import { v4 } from "uuid";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DataNotFound, Display, Loading, Title } from "@/components/index";
import { FormType } from "@/types/lib";
import { Dates } from "@/utils/index";
import { VaccineDataType } from "@/types/index";
import { VaccineRepository } from "@/repos/index";

export default function VaccinesPage() {
  useRequireAuth();

  const { isMobile, selectedPet } = useAppContext();
      const [petVaccines, setPetVaccines] = useState<VaccineDataType[] | null>(null);
  
      useEffect(() => {
          if (!selectedPet?.id) return;         // don't run if no pet selected
  
          const fetchData = async () => {
              try {
                  const vaccines = await new VaccineRepository().findByParentId(selectedPet.id);
                  setPetVaccines(vaccines);
              } catch (err) {
                  console.error("Error loading medicines:", err);
                  // you might set an error state here
              }
          };
  
          fetchData();
      }, [selectedPet?.id]);

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
    return <Display formItems={formItems} isMobile={isMobile} />;
  };

  return (
    <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
      {<Title icon={ <FaSyringe />} title="Vacunas" />}
      {renderContent(isMobile)}
    </main>
  );
}