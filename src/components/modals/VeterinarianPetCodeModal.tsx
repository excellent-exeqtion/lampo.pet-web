// src/components/modals/VeterinarianPetCodeModal.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ModalComponent from "../lib/modal";
import { postFetch, getFetch } from "@/app/api";
import { useStorageContext } from "@/context/StorageProvider";
import { useVetContext } from "@/context/VetContext";

interface VeterinarianPetCodeModalProps {
    initialCode?: string;
    setShowVetPetCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VeterinarianPetCodeModal({ initialCode, setShowVetPetCodeModal }: VeterinarianPetCodeModalProps) {
    const router = useRouter();
    const { vet } = useVetContext();

    const storage = useStorageContext();

    const [code, setCode] = useState(initialCode || "");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Si se provee un código inicial y tenemos los datos del veterinario, intentamos el acceso automáticamente.
        if (initialCode && vet) {
            handleSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialCode, vet]);

    if (!vet) {
        return null; // O un spinner si prefieres esperar a que el contexto del vet cargue.
    }

    const handleSubmit = async () => {
        setError("");
        const sanitizedCode = code.trim().toUpperCase();
        if (!sanitizedCode) {
            setError("Por favor ingresa el código de la mascota.");
            return;
        }
        setLoading(true);

        try {
            const vetPayload = {
                code: sanitizedCode,
                firstName: vet.first_name,
                firstLastName: vet.first_last_name,
                secondLastName: vet.second_last_name,
                identification: vet.identification,
                registration: vet.registration,
                clinicName: vet.clinic_name,
                city: vet.city
            };
            const res = await postFetch("/api/vet/use-code", undefined, vetPayload);
            const data = await res.json();

            if (!res.ok || data.error) {
                setError(data.error || "Código inválido o expirado.");
            } else {
                const petRes = await getFetch(`/api/pets/${data.pet_id}`);
                if (!petRes.ok) {
                    setError("No se encontró la mascota.");
                } else {
                    const petData = await petRes.json();
                    storage.setStoredPet(petData);
                    storage.setStoredOwnerPets([]);
                    storage.setStoredVetAccess({
                        id: data.vet_access,
                        pet_id: petData.id,
                        pet_code_id: data.pet_code,
                        vet_first_name: vet.first_name,
                        vet_first_last_name: vet.first_last_name,
                        vet_second_last_name: vet.second_last_name,
                        identification: vet.identification,
                        professional_registration: vet.registration,
                        clinic_name: vet.clinic_name,
                        city: vet.city
                    });
                    setShowVetPetCodeModal(false);
                    router.push(`/pages/vet/consultation/${petData.id}`);
                }
            }
        } catch {
            setError("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalComponent
            title="Acceder a historial"
            description="Solo ingresa el código de la mascota para acceder a su historial"
            setShowModal={setShowVetPetCodeModal}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {/* Inputs ocultos con datos del veterinario */}
                <input type="hidden" name="firstName" value={vet.first_name} />
                <input type="hidden" name="firstLastName" value={vet.first_last_name} />
                <input type="hidden" name="secondLastName" value={vet.second_last_name} />
                <input type="hidden" name="identification" value={vet.identification} />
                <input type="hidden" name="registration" value={vet.registration} />
                <input type="hidden" name="clinicName" value={vet.clinic_name} />
                <input type="hidden" name="city" value={vet.city} />

                <label className="label">
                    Código de la mascota
                    <input
                        type="text"
                        className="input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. U8Y499"
                        required
                        autoFocus
                    />
                </label>

                {error && <p className="error" style={{ color: 'var(--pico-color-red-500)' }}>{error}</p>}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                    aria-busy={loading}
                >
                    {loading ? "Validando..." : "Acceder"}
                </button>
            </form>
        </ModalComponent>
    );
}