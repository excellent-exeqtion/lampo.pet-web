// components/modals/AddPetModal.tsx
"use client";

import React, { useState } from "react";
import { useAppContext } from "@/app/layout";
import { PetNameForm, BasicDataForm, VaccineForm, MedicineForm, LabTestForm, ConditionForm, SurgeryForm } from "@/components/forms/index";
import { BasicDataType, PetStep, type PetType } from "@/types/index";
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
    const [step, setStep] = useState(1);
    //const [pet, setPet] = useState<PetType>(EmptyPet);
    const [pet, setPet] = useState<PetType>({ id: 'S937', name: 'Cherry', image: '/pets/cherry.png', owner_id: '6c006265-400d-493a-b226-a5712b0e4b4e' });
    const [basicData, setBasicData] = useState<BasicDataType>(Empty.BasicData);
    //const [stepStates, setStepStates] = useState<StepsStateType[]>([]);
    const [stepStates, setStepStates] = useState<StepsStateType[]>([{ number: 0, state: 0 }]);

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
                return <PetNameForm ownerId={ownerId} pet={pet} setPet={setPet} onNext={next} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.BasicData:
                return <BasicDataForm petId={pet.id!} basicData={basicData} setBasicData={setBasicData} onNext={next} stepStates={stepStates} setStepStates={setStepStates} />;
            case PetStep.Vaccines:
                return <VaccineForm petId={pet.id!} onNext={next} />;
            case PetStep.Medicines:
                return <MedicineForm petId={pet.id!} onNext={next} />;
            case PetStep.LabTests:
                return <LabTestForm petId={pet.id!} onNext={next} />;
            case PetStep.Conditions:
                return <ConditionForm petId={pet.id!} onNext={next} />;
            case PetStep.Surgeries:
                return <SurgeryForm petId={pet.id!} onNext={finalize} />;
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

    return (
        <Modal title={stepTitle()} setShowModal={setShowAddPetModal} maxWidth="1000px">
            <div className="space-y-4">{renderStep()}</div>
            <div className="mt-4 flex justify-between">
                {step > 0 && (
                    <button
                        type="button"
                        onClick={back}
                        className="btn-secondary ml-auto"
                    >
                        Atrás
                    </button>
                )}
                {step >= 2 && (
                    <div className="tooltip-container" style={{ float: 'right' }}>
                        <a onClick={skipHandler} >
                            Saltar
                        </a>
                        <span className="tooltip-text" style={{ border: 'groove', color: '#000', fontWeight: 'normal', borderRadius: '20px' }}>No te preocupes puedes agregar esta información más tarde.</span>
                    </div>
                )}
            </div>
        </Modal>
    );
}
