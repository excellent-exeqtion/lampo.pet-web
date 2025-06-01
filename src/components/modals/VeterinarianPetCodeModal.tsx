// src/components/modals/VeterinarianPetCodeModal.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ModalComponent from "../lib/modal";
import { postFetch, getFetch } from "@/app/api";
import { useStorageContext } from "@/context/StorageProvider";
import { useVetContext } from "@/context/VetContext";
import { useUI } from "@/context/UIProvider";

export default function VeterinarianPetCodeModal() {
    const router = useRouter();
    const { vet } = useVetContext();
    const { setShowVetPetCodeModal } = useUI();

    const storage = useStorageContext();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!vet) {
        return;
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
            // Envío de código junto con datos ocultos del veterinario
            const vetPayload = {
                code: sanitizedCode,
                firstName: vet.first_name,
                lastName: vet.last_name,
                registration: vet.registration,
                clinicName: vet.clinic_name,
                city: vet.city
            };
            const res = await postFetch("/api/vet/use-code", undefined, vetPayload);
            const data = await res.json();

            if (!res.ok || data.error) {
                setError(data.error || "Código inválido o expirado.");
            } else {
                // Obtener datos de la mascota y almacenar
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
                        vet_last_name: vet.last_name,
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
                <input type="hidden" name="lastName" value={vet.last_name} />
                <input type="hidden" name="registration" value={vet.registration} />
                <input type="hidden" name="clinicName" value={vet.clinic_name} />
                <input type="hidden" name="city" value={vet.city} />

                {/* Input visible para el código */}
                <label className="label">
                    Código de la mascota
                    <input
                        type="text"
                        className="input"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. U8Y499"
                        required
                    />
                </label>

                {error && <p className="error">{error}</p>}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? "Validando..." : "Acceder"}
                </button>
            </form>
        </ModalComponent>
    );
}
