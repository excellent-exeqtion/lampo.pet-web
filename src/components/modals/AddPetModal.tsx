// src/components/modals/AddPetModal.tsx
"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAppContext } from "@/app/layout";
import Modal from "../lib/modal";
import EntityForm from "../lib/entityForm";

import {
  PetNameForm,
  BasicDataForm,
} from "@/components/forms";


import {
  emptyVaccine,
  emptyMedicine,
  emptyLabTest,
  emptyCondition,
  emptySurgery,
} from "@/utils/factories";

import {
  PetStep,
  PetType,
  BasicDataType,
  VaccineDataType,
  MedicineDataType,
  LabTestDataType,
  ConditionDataType,
  SurgeryDataType,
} from "@/types/index";

import type { StepsStateType, FieldConfig } from "@/types/lib";
import { InitialStepsState } from "@/types/index";
import { Empty } from "@/data/index";
import { ConditionRepository, LabTestRepository, MedicineRepository, SurgeryRepository, VaccineRepository } from "@/repos/index";

interface AddPetModalProps {
  setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddPetModal({ setShowAddPetModal }: AddPetModalProps) {
  const { session, storedOwnerPets, setStoredOwnerPets, setStoredPet } = useAppContext();
  const [step, setStep] = useState<PetStep>(PetStep.Name);

  // Estados por entidad
  const [pet, setPet] = useState<PetType>(Empty.Pet());
  const [basicData, setBasicData] = useState<BasicDataType>(Empty.BasicData());
  const [vaccinesData, setVaccinesData] = useState<VaccineDataType[]>([Empty.VaccineData()]);
  const [medicinesData, setMedicinesData] = useState<MedicineDataType[]>([Empty.MedicineData()]);
  const [labTestsData, setLabTestsData] = useState<LabTestDataType[]>([Empty.LabTestData()]);
  const [conditionsData, setConditionsData] = useState<ConditionDataType[]>([Empty.ConditionData()]);
  const [surgeriesData, setSurgeriesData] = useState<SurgeryDataType[]>([Empty.SurgeryData()]);

  const [stepStates, setStepStates] = useState<StepsStateType[]>(InitialStepsState);

  useEffect(() => {
    console.log("Step states:", stepStates);
  }, [stepStates]);

  // Validar sesión
  if (!session?.db?.user?.id) return null;
  const ownerId = session.db.user.id;

  const totalSteps = 7;
  const next = () => setStep(s => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const finalize = () => {
    if (!pet.id) return;
    pet.owner_id = ownerId;
    setStoredOwnerPets([...(storedOwnerPets ?? []), pet]);
    setStoredPet(pet);
    setShowAddPetModal(false);
  };
  const skipHandler = () => (step < totalSteps - 1 ? next() : finalize());

  // Configuración dinámica para los pasos que usan EntityForm
  type StepConfig<T> = {
    entityName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repository: { new(): any };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveFn: (items: T[]) => Promise<Partial<T>>;
    emptyFactory: (petId: string) => T;
    fieldsConfig: FieldConfig<T>[];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stepConfigs: Record<PetStep, StepConfig<any>> = {
    [PetStep.Vaccines]: {
      entityName: "vacuna",
      repository: VaccineRepository,
      saveFn: VaccineRepository.createAll,
      emptyFactory: emptyVaccine,
      fieldsConfig: [
        { label: "Nombre *",      name: "name",        type: "text", mandatory: true, className: "w-full" },
        { label: "Descripción",   name: "description", type: "text",                className: "w-full" },
        { label: "Fecha",         name: "date",        type: "date",                className: "w-full" },
        { label: "Lote *",        name: "batch",       type: "text", mandatory: true, className: "w-full" },
        { label: "Marca *",       name: "brand",       type: "text", mandatory: true, className: "w-full" },
      ],
    },
    [PetStep.Medicines]: {
      entityName: "medicina",
      repository: MedicineRepository,
      saveFn: MedicineRepository.createAll,
      emptyFactory: emptyMedicine,
      fieldsConfig: [
        { label: "Nombre *",     name: "name",      type: "text", mandatory: true, className: "w-full" },
        { label: "Dosis *",      name: "dosage",   type: "text", mandatory: true, className: "w-full" },
        { label: "Frecuencia *", name: "frequency", type: "text", mandatory: true, className: "w-full" },
      ],
    },
    [PetStep.LabTests]: {
      entityName: "prueba",
      repository: LabTestRepository,
      saveFn: LabTestRepository.createAll,
      emptyFactory: emptyLabTest,
      fieldsConfig: [
        { label: "Nombre *",   name: "name",   type: "text", mandatory: true, className: "w-full" },
        { label: "Tipo *",     name: "type",   type: "text", mandatory: true, className: "w-full" },
        { label: "Fecha",      name: "date",   type: "date",                className: "w-full" },
        { label: "Resultado",  name: "result", type: "text",                className: "w-full" },
      ],
    },
    [PetStep.Conditions]: {
      entityName: "condición",
      repository: ConditionRepository,
      saveFn: ConditionRepository.createAll,
      emptyFactory: emptyCondition,
      fieldsConfig: [
        { label: "Condición *", name: "condition", type: "text", mandatory: true, className: "w-full" },
        { label: "Severidad *", name: "severity",  type: "text", mandatory: true, className: "w-full" },
      ],
    },
    [PetStep.Surgeries]: {
      entityName: "cirugía",
      repository: SurgeryRepository,
      saveFn: SurgeryRepository.createAll,
      emptyFactory: emptySurgery,
      fieldsConfig: [
        { label: "Nombre *",      name: "name",        type: "text", mandatory: true, className: "w-full" },
        { label: "Fecha",         name: "date",        type: "date",                className: "w-full" },
        { label: "Descripción",   name: "description", type: "text",                className: "w-full" },
      ],
    },
  };

  // Mapeo de datos y setters por paso
  const dataMap = {
    [PetStep.Vaccines]: [vaccinesData, setVaccinesData] as const,
    [PetStep.Medicines]: [medicinesData, setMedicinesData] as const,
    [PetStep.LabTests]: [labTestsData, setLabTestsData] as const,
    [PetStep.Conditions]: [conditionsData, setConditionsData] as const,
    [PetStep.Surgeries]: [surgeriesData, setSurgeriesData] as const,
  };

  const renderStep = () => {
    switch (step) {
      case PetStep.Name:
        return (
          <PetNameForm
            ownerId={ownerId}
            pet={pet}
            setPet={setPet}
            onNext={next}
            onBack={back}
            stepStates={stepStates}
            setStepStates={setStepStates}
          />
        );

      case PetStep.BasicData:
        return (
          <BasicDataForm
            petId={pet.id!}
            basicData={basicData}
            setBasicData={setBasicData}
            onNext={next}
            onBack={back}
            stepStates={stepStates}
            setStepStates={setStepStates}
          />
        );

      default: {
        const cfg = stepConfigs[step];
        const [items, setItems] = dataMap[step];
        return (
          <EntityForm
            key={step}
            petId={pet.id!}
            data={items}
            setData={setItems}
            step={step}
            stepStates={stepStates}
            setStepStates={setStepStates}
            entityName={cfg.entityName}
            repository={new cfg.repository()}
            emptyFactory={cfg.emptyFactory}
            saveFn={cfg.saveFn}
            fieldsConfig={cfg.fieldsConfig}
            onNext={step === PetStep.Surgeries ? finalize : next}
            onBack={back}
          />
        );
      }
    }
  };

  const stepTitle = () => {
    const titles: Record<PetStep, string> = {
      [PetStep.Name]: "Agrega tu mascota",
      [PetStep.BasicData]: `Datos básicos de ${pet.name}`,
      [PetStep.Vaccines]: `Información de vacunas de ${pet.name}`,
      [PetStep.Medicines]: `Información de medicamentos de ${pet.name}`,
      [PetStep.LabTests]: `Información de exámenes de ${pet.name}`,
      [PetStep.Conditions]: `Información de condiciones especiales de ${pet.name}`,
      [PetStep.Surgeries]: `Información de cirugías de ${pet.name}`,
    };
    return titles[step] || "";
  };

  const skipForm = step > PetStep.BasicData;

  return (
    <Modal
      title={stepTitle()}
      setShowModal={setShowAddPetModal}
      maxWidth="1000px"
      skipForm={
        skipForm ? (
          <div className="tooltip-container" style={{ float: "right" }}>
            <a onClick={skipHandler} style={{ fontSize: 18 }}>
              Agregar después
            </a>
          </div>
        ) : null
      }
    >
      {renderStep()}
    </Modal>
  );
}
