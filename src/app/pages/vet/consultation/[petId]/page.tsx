// src/app/pages/vet/consultation/[petId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Title, Loading, DataNotFound } from "@/components/index";
import { PetType, CreateConsultationPayload } from "@/types/index";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useVetContext } from "@/context/VetContext"; // Si los datos del vet vienen de aquí
import { getFetch, postFetch } from "@/app/api";
import { FaClipboardList } from "react-icons/fa";
import { ConsultationForm } from "../ConsultationForm";

export default function ConsultationPage() {
    console.log('entro aqui')
    const router = useRouter();
    const params = useParams();
    const petId = params.petId as string;

    const { db: session } = useSessionContext();
    const { storedPet, storedVetAccess, setStoredPet } = useStorageContext();
    const { vet: veterinarianData } = useVetContext(); // Datos del veterinario logueado

    const [pet, setPet] = useState<PetType | null>(storedPet.id === petId ? storedPet : null);
    const [loadingPet, setLoadingPet] = useState<boolean>(!pet);
    const [errorPet, setErrorPet] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!petId) {
            setErrorPet("ID de mascota no encontrado en la ruta.");
            setLoadingPet(false);
            return;
        }

        if (storedPet.id === petId) {
            setPet(storedPet);
            setLoadingPet(false);
        } else {
            const fetchPet = async () => {
                try {
                    const response = await getFetch(`/api/pets/${petId}`);
                    const petData = await response.json();
                    if (!response.ok || !petData) {
                        throw new Error(petData.message || "Mascota no encontrada");
                    }
                    setPet(petData);
                    setStoredPet(petData); // Actualizar el contexto si se carga una diferente
                } catch (err) {
                    console.error("Error fetching pet:", err);
                    setErrorPet(err instanceof Error ? err.message : "Error cargando datos de la mascota.");
                } finally {
                    setLoadingPet(false);
                }
            };
            fetchPet();
        }
    }, [petId, storedPet, setStoredPet]);

    console.log('entro aqui')
    const handleFormSubmit = async (formData: CreateConsultationPayload) => {
        setSubmitting(true);
        setSubmitError(null);

        const payload: CreateConsultationPayload = {
            ...formData,
            pet_id: petId,
        };

        // Determinar quién registra la consulta
        if (veterinarianData?.vet_id && session?.user?.user_metadata?.role === 'veterinarian') {
            payload.veterinarian_id = veterinarianData.vet_id;
        } else if (storedVetAccess?.id) {
            // Si se accedió con código y el usuario actual NO es un veterinario con sesión
            // (o si queremos priorizar el vet_access_id si existe)
            payload.veterinary_access_id = storedVetAccess.id;
            // Opcionalmente, podrías querer también el ID del usuario que está usando el código si está logueado
            // payload.uploaded_by_user_id = session?.user?.id;
        } else {
            setSubmitError("No se pudo identificar al veterinario responsable. Inicie sesión como veterinario o use un código de acceso válido.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await postFetch('/api/consultations', undefined, payload);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Error al guardar la consulta.");
            }

            // Aquí podrías manejar la subida de archivos si se hace después de crear la consulta
            // o si el `ConsultationForm` maneja la subida de archivos y pasa las URLs/IDs

            alert("Consulta guardada exitosamente.");
            // Redirigir a la página de la mascota o a una lista de consultas
            router.push(`/pages/pet/basic-data`); // O una ruta más apropiada

        } catch (err) {
            console.error("Error submitting consultation:", err);
            setSubmitError(err instanceof Error ? err.message : "Error desconocido al guardar.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingPet) return <Loading />;
    if (errorPet) return <DataNotFound message={errorPet} />;
    if (!pet) return <DataNotFound message="Mascota no encontrada." />;
    return (
        <main style={{ padding: "2rem" }}>
            <Title icon={<FaClipboardList />} title={`Nueva Consulta para ${pet.name}`} />

            {submitError && <p className="text-error" style={{ marginTop: '1rem' }}>{submitError}</p>}

            <ConsultationForm
                pet={pet}
                onSubmit={handleFormSubmit}
                isSubmitting={submitting}
            // Pasar datos del veterinario si se van a mostrar en el form (ej. nombre del profesional)
            // veterinarianInfo={veterinarianData || storedVetAccess}
            />
        </main>
    );
}