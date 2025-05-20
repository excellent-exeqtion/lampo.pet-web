// components/modals/AddPetModal.tsx
"use client";

import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "@/app/layout";
import { PetRepository } from "@/repos/pet.repository";
import { generateUniquePetId } from "@/utils/random";
import { BasicDataForm } from "@/components/forms/BasicDataForm";
import { VaccineForm } from "@/components/forms/VaccineForm";
import { MedicineForm } from "@/components/forms/MedicineForm";
import { LabTestForm } from "@/components/forms/LabTestForm";
import { ConditionForm } from "@/components/forms/ConditionForm";
import { SurgeryForm } from "@/components/forms/SurgeryForm";
import type { PetType } from "@/types/index";
import type { Dispatch, SetStateAction } from "react";

interface AddPetModalProps {
    setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
}

export default function AddPetModal({ setShowAddPetModal }: AddPetModalProps) {
    const { session, storedOwnerPets, setStoredOwnerPets, setStoredPet } = useAppContext();
    const [step, setStep] = useState(0);
    const [petId, setPetId] = useState<string | null>(null);
    const [petName, setPetName] = useState("");
    const [petImage, setPetImage] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    // Paso 0: crear mascota
    const handleCreatePet = async () => {
        setError(null);
        setLoading(true);
        try {
            const newId = await generateUniquePetId();
            const { error: petErr } = await PetRepository.create({
                id: newId,
                name: petName,
                image: petImage,
                owner_id: ownerId,
            });
            if (petErr) throw new Error(petErr?.message || "Error creando mascota");
            setPetId(newId);
            next();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Skip en formularios opcionales
    const skipHandler = () => {
        if (step < totalSteps - 1) next(); else finalize();
    };

    // Renderiza el componente según el paso actual
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="grid grid-cols-1 gap-4" style={{display: 'flow'}}>
                        <label>
                            Nombre
                            <input
                                type="text"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            URL de imagen
                            <input
                                type="text"
                                value={petImage}
                                onChange={(e) => setPetImage(e.target.value)}
                            />
                        </label>
                        {error && <p className="text-error">{error}</p>}
                        <button
                            type="button"
                            onClick={handleCreatePet}
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? "Creando…" : "Siguiente"}
                        </button>
                    </div>
                );
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

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "90%",
                    maxWidth: "400px",
                    position: "relative",
                }}
            >
                {/* Close button */}
                <button
                    onClick={() => setShowAddPetModal(false)}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        cursor: "pointer",
                        color: '#000'
                    }}
                    aria-label="Cerrar modal"
                >
                    <FaTimes />
                </button>
                <h2 className="text-xl font-semibold mb-4">Paso {step + 1} de {totalSteps}</h2>
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
            </div>
        </div>
    );
}
