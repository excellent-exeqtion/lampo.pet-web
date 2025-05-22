// components/modals/AddPetModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/app/layout";
import { PetNameForm, BasicDataForm, VaccineForm, MedicineForm, LabTestForm, ConditionForm, SurgeryForm } from "@/components/forms/index";
import { BasicDataType, ConditionDataType, InitialStepsState, LabTestDataType, MedicineDataType, PetStep, SurgeryDataType, VaccineDataType, type PetType } from "@/types/index";
import type { Dispatch, SetStateAction } from "react";
import { } from "@/components/forms/PetNameForm";
import Modal from "../lib/modal";
import { StepsStateType } from "@/types/lib";
import { Empty } from "@/data/index";

interface AddPetModalProps {
    setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddPetModal({ setShowAddPetModal }: AddPetModalProps) {
    const { session, storedOwnerPets, setStoredOwnerPets, setStoredPet } = useAppContext();
    const [step, setStep] = useState(0);
    //const [pet, setPet] = useState<PetType>(Empty.Pet());
    const [pet, setPet] = useState<PetType>({ id: 'S937', name: 'Cherry', image: '/pets/cherry.png', owner_id: '6c006265-400d-493a-b226-a5712b0e4b4e' });
    const [basicData, setBasicData] = useState<BasicDataType>(Empty.BasicData());
    const [vaccinesData, setVaccinesData] = useState<VaccineDataType[]>([Empty.VaccineData()]);
    const [conditionsData, setConditionsData] = useState<ConditionDataType[]>([Empty.ConditionData()]);
    const [medicinesData, setMedicinesData] = useState<MedicineDataType[]>([Empty.MedicineData()]);
    const [labTestsData, setLabTestsData] = useState<LabTestDataType[]>([Empty.LabTestData()]);
    const [surgeriesData, setSurgeriesData] = useState<SurgeryDataType[]>([Empty.SurgeryData()]);
    //const [stepStates, setStepStates] = useState<StepsStateType[]>([]);
    const [stepStates, setStepStates] = useState<StepsStateType[]>(InitialStepsState);

    useEffect(() => {
        console.log(stepStates)
    }, [stepStates, setStepStates]);

    // Validar sesión
    if (!session?.db?.user?.id) {
        console.error("No hay sesión activa o falta el user.id");
        return null;
    }
    const ownerId: string = session.db.user.id;

    const totalSteps = 7; // 0: pet info, 1: basic data, 2-6: optional forms

    // Navegación
    const next = () => setStep((s) => s + 1);
    const back = () => setStep((s) => Math.max(s - 1, 0));

    // Finalizar: actualizar contexto y cerrar modal
    const finalize = () => {
        if (!pet.id) return;
        pet.owner_id = ownerId;
        setStoredOwnerPets([...(storedOwnerPets ?? []), pet]);
        setStoredPet(pet);
        setShowAddPetModal(false);
    };

    // Skip en formularios opcionales
    const skipHandler = () => {
        if (step < totalSteps - 1) next(); else finalize();
    };

    // Renderiza el componente según el paso actual
    const renderStep = () => {
        switch (step) {
            case PetStep.Name:
                return <PetNameForm ownerId={ownerId} pet={pet} setPet={setPet} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.BasicData:
                return <BasicDataForm petId={pet.id!} basicData={basicData} setBasicData={setBasicData} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.Vaccines:
                return <VaccineForm petId={pet.id!} vaccinesData={vaccinesData} setVaccinesData={setVaccinesData} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.Medicines:
                return <MedicineForm petId={pet.id!} medicinesData={medicinesData} setMedicinesData={setMedicinesData} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.LabTests:
                return <LabTestForm petId={pet.id!} labTestsData={labTestsData} setLabTestsData={setLabTestsData} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.Conditions:
                return <ConditionForm petId={pet.id!} conditionsData={conditionsData} setConditionsData={setConditionsData} onNext={next} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.Surgeries:
                return <SurgeryForm petId={pet.id!} surgeriesData={surgeriesData} setSurgeriesData={setSurgeriesData} onNext={finalize} onBack={back} stepStates={stepStates} setStepStates={setStepStates} />;
            default:
                return null;
        }
    };

    const stepTitle = () => {
        switch (step) {
            case PetStep.Name:
                return "Agrega tu mascota";
            case PetStep.BasicData:
                return `Datos básicos de ${pet.name}`;
            case PetStep.Vaccines:
                return `Información de vacunas de ${pet.name}`;
            case PetStep.Medicines:
                return `Información de medicamentos de ${pet.name}`;
            case PetStep.LabTests:
                return `Información de examenés de laboratorio de ${pet.name}`;
            case PetStep.Conditions:
                return `Información de condiciones especiales de ${pet.name}`;
            case PetStep.Surgeries:
                return `Información de cirugías de ${pet.name}`;
            default:
                return "";
        }
    }


    const skipForm = (show: boolean) => {
        if (!show) {
            return <div></div>;
        }
        else {
            return (
                <div className="tooltip-container" style={{ float: 'right' }}>
                    <a onClick={skipHandler} style={{ fontSize: '18px' }} >
                        Agregar después
                    </a>
                </div>
            );
        }
    }

    return (

        <Modal title={stepTitle()} setShowModal={setShowAddPetModal} maxWidth="1000px" skipForm={skipForm(step > 2)}>
            {renderStep()}
        </Modal>
    );
}
