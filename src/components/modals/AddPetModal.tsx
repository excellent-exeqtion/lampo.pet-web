// src/components/modals/AddPetModal.tsx
"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import ModalComponent from "../lib/modal";
import { EntityForm } from "@/components/index";

import { PetNameForm, BasicDataForm } from "@/components/forms";

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
    SurgeryDataType
} from "@/types/index";

import type { StepsStateType, StepConfig } from "@/types/lib";
import { Empty } from "@/data/index";
import { usePetStorage } from "@/context/PetStorageProvider";
import { useSessionContext } from "@/context/SessionProvider";

interface AddPetModalProps {
    editPet?: PetType,
    showAddPetModal: boolean;
    setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}


export default function AddPetModal({ editPet, showAddPetModal, setShowAddPetModal }: AddPetModalProps) {
    const session = useSessionContext();
    const storage = usePetStorage();
    const [step, setStep] = useState<PetStep>(PetStep.Name);

    // Estados por entidad
    const [pet, setPet] = useState<PetType>(editPet == undefined ? Empty.Pet() : editPet);
    const [basicData, setBasicData] = useState<BasicDataType>(Empty.BasicData());
    const [vaccinesData, setVaccinesData] = useState<VaccineDataType[]>([]);
    const [medicinesData, setMedicinesData] = useState<MedicineDataType[]>([]);
    const [labTestsData, setLabTestsData] = useState<LabTestDataType[]>([]);
    const [conditionsData, setConditionsData] = useState<ConditionDataType[]>([]);
    const [surgeriesData, setSurgeriesData] = useState<SurgeryDataType[]>([]);
    const [stepStates, setStepStates] = useState<StepsStateType[]>(Empty.Steps());


    useEffect(() => {
        setStepStates(Empty.Steps());
    }, [showAddPetModal])

    // Validar sesión
    if (!session?.db?.user?.id) return null;
    const ownerId = session.db.user.id;

    const totalSteps = 7;
    const next = () => setStep(s => Math.min(s + 1, totalSteps - 1));
    const back = () => setStep(s => Math.max(s - 1, 0));
    const finalize = () => {
        if (!pet.id) return;
        pet.owner_id = ownerId;
        storage.setStoredOwnerPets([...(storage.storedOwnerPets ?? []), pet]);
        setShowAddPetModal(false);
        setStepStates(Empty.Steps());
    };

    // Configuración dinámica para los pasos que usan EntityForm
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stepConfigs: Partial<Record<PetStep, StepConfig<any>>> = {
        [PetStep.Vaccines]: {
            entityName: "vacuna",
            storedList: storage.storedVaccineData,
            setStoredList: storage.setStoredVaccineData,
            emptyFactory: emptyVaccine,
            fieldsConfig: [
                { label: "Nombre *", name: "name", type: "text", mandatory: true, className: "w-full" },
                { label: "Descripción", name: "description", type: "text", className: "w-full" },
                { label: "Fecha", name: "date", type: "date", className: "w-full" },
                { label: "Lote *", name: "batch", type: "text", mandatory: true, className: "w-full" },
                { label: "Marca *", name: "brand", type: "text", mandatory: true, className: "w-full" },
            ],
        },
        [PetStep.Medicines]: {
            entityName: "medicina",
            storedList: storage.storedMedicineData,
            setStoredList: storage.setStoredMedicineData,
            emptyFactory: emptyMedicine,
            fieldsConfig: [
                { label: "Nombre *", name: "name", type: "text", mandatory: true, className: "w-full" },
                { label: "Dosis *", name: "dosage", type: "text", mandatory: true, className: "w-full" },
                { label: "Frecuencia *", name: "frequency", type: "text", mandatory: true, className: "w-full" },
            ],
        },
        [PetStep.LabTests]: {
            entityName: "prueba",
            storedList: storage.storedLabTestData,
            setStoredList: storage.setStoredLabTestData,
            emptyFactory: emptyLabTest,
            fieldsConfig: [
                { label: "Nombre *", name: "name", type: "text", mandatory: true, className: "w-full" },
                { label: "Tipo *", name: "type", type: "text", mandatory: true, className: "w-full" },
                { label: "Fecha", name: "date", type: "date", className: "w-full" },
                { label: "Resultado", name: "result", type: "text", className: "w-full" },
            ],
        },
        [PetStep.Conditions]: {
            entityName: "condición",
            storedList: storage.storedConditionData,
            setStoredList: storage.setStoredConditionData,
            emptyFactory: emptyCondition,
            fieldsConfig: [
                { label: "Condición *", name: "condition", type: "text", mandatory: true, className: "w-full" },
                { label: "Severidad *", name: "severity", type: "text", mandatory: true, className: "w-full" },
            ],
        },
        [PetStep.Surgeries]: {
            entityName: "cirugía",
            storedList: storage.storedSurgeryData,
            setStoredList: storage.setStoredSurgeryData,
            emptyFactory: emptySurgery,
            fieldsConfig: [
                { label: "Nombre *", name: "name", type: "text", mandatory: true, className: "w-full" },
                { label: "Fecha", name: "date", type: "date", className: "w-full" },
                { label: "Descripción", name: "description", type: "text", className: "w-full" },
            ],
        },
    };

    // Mapeo de datos y setters por paso
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataMap: Partial<Record<PetStep, [any[], Dispatch<SetStateAction<any[]>>]>> = {
        [PetStep.Vaccines]: [vaccinesData, setVaccinesData],
        [PetStep.Medicines]: [medicinesData, setMedicinesData],
        [PetStep.LabTests]: [labTestsData, setLabTestsData],
        [PetStep.Conditions]: [conditionsData, setConditionsData],
        [PetStep.Surgeries]: [surgeriesData, setSurgeriesData],
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
                        pet={pet}
                        basicData={basicData}
                        setBasicData={setBasicData}
                        onNext={next}
                        onBack={back}
                        stepStates={stepStates}
                        setStepStates={setStepStates}
                    />
                );

            default: {
                // TS: usamos Partial y ! para asegurar que cfg y data existen
                const cfg = stepConfigs[step]!;
                const [items, setItems] = dataMap[step]!;

                return (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <EntityForm<any>
                        key={step}
                        id={pet.id!}
                        storedList={cfg.storedList}
                        setStoredList={cfg.setStoredList}
                        data={items}
                        setData={setItems}
                        step={step}
                        stepStates={stepStates}
                        setStepStates={setStepStates}
                        entityName={cfg.entityName}
                        emptyFactory={cfg.emptyFactory}
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

    return (
        <ModalComponent title={stepTitle()} setShowModal={setShowAddPetModal} maxWidth="1000px">
            {renderStep()}
        </ModalComponent>
    );
}
