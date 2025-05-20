// components/modals/AddPetModal.tsx
"use client";

import React, { useState } from "react";
import { useAppContext } from "@/app/layout";
import { PetForm, BasicDataForm, VaccineForm, MedicineForm, LabTestForm, ConditionForm, SurgeryForm } from "@/components/forms/index";
import type { PetType } from "@/types/index";
import type { Dispatch, SetStateAction } from "react";
import { } from "@/components/forms/PetForm";
import Modal from "../lib/modal";

interface AddPetModalProps {
    setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddPetModal({ setShowAddPetModal }: AddPetModalProps) {
    const { session, storedOwnerPets, setStoredOwnerPets, setStoredPet } = useAppContext();
    const [step, setStep] = useState(1);
    const [petId, setPetId] = useState<string | null>("S937");
    const [petName, setPetName] = useState("Cherry");
    const [petImage, setPetImage] = useState("/pets/cherry.png");

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
        if (!petId) return;
        const newPet: PetType = { id: petId, name: petName, image: petImage, owner_id: ownerId } as PetType;
        setStoredOwnerPets([...(storedOwnerPets ?? []), newPet]);
        setStoredPet(newPet);
        setShowAddPetModal(false);
    };

    // Skip en formularios opcionales
    const skipHandler = () => {
        if (step < totalSteps - 1) next(); else finalize();
    };

    // Renderiza el componente según el paso actual
    const renderStep = () => {
        switch (step) {
            case 0:
                return <PetForm ownerId={ownerId} setPetId={setPetId} petName={petName} setPetName={setPetName} petImage={petImage} setPetImage={setPetImage} onNext={next} />;
            case 1:
                return <BasicDataForm petId={petId!} onNext={next} />;
            case 2:
                return <VaccineForm petId={petId!} onNext={next} />;
            case 3:
                return <MedicineForm petId={petId!} onNext={next} />;
            case 4:
                return <LabTestForm petId={petId!} onNext={next} />;
            case 5:
                return <ConditionForm petId={petId!} onNext={next} />;
            case 6:
                return <SurgeryForm petId={petId!} onNext={finalize} />;
            default:
                return null;
        }
    };

    const stepTitle = () => {
        switch (step) {
            case 0:
                return "Agrega tu mascota";
            case 1:
                return `Datos básicos de ${petName}`;
            case 2:
                return `Información de vacunas de ${petName}`;
            case 3:
                return `Información de medicamentos de ${petName}`;
            case 4:
                return `Información de examenés de laboratorio de ${petName}`;
            case 5:
                return `Información de condiciones especiales de ${petName}`;
            case 5:
                return `Información de cirugías de ${petName}`;
            default:
                return "";
        }
    }

    return (
        <Modal title={stepTitle()} setShowModal={setShowAddPetModal} maxWidth="1000px">
            <div className="space-y-4">{renderStep()}</div>
            <div className="mt-4 flex justify-between">
                {step >= 2 && (
                    <button
                        type="button"
                        onClick={skipHandler}
                        className="btn-outline"
                    >
                        Agregar más tarde
                    </button>
                )}
                {step > 0 && (
                    <button
                        type="button"
                        onClick={back}
                        className="btn-secondary ml-auto"
                    >
                        Atrás
                    </button>
                )}
            </div>
        </Modal>
    );
}
