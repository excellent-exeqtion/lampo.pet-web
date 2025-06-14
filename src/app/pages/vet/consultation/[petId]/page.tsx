// src/app/pages/vet/consultation/[petId]/page.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Title, Loading, DataNotFound, AlertModal } from "@/components/index";
import { PetType, CreateConsultationPayload, BasicDataType, VaccineDataType, SurgeryDataType, MedicineDataType, ConditionDataType, OwnerDataType } from "@/types/index";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useVetContext } from "@/context/VetContext";
import { getFetch, postFetch } from "@/app/api";
import { FaClipboardList } from "react-icons/fa";
import ConsultationPetSummary from "@/components/consultations/ConsultationPetSummary";
import { ConsultationForm } from "../ConsultationForm";

type ConsultationSubmitHandle = {
    triggerFileUploads: (consultationId: string) => Promise<void>;
};

export default function ConsultationPage() {
    const router = useRouter();
    const params = useParams();
    const petId = params.petId as string;
    const formRef = useRef<ConsultationSubmitHandle>(null);

    const { db: session } = useSessionContext();
    const { storedPet, storedVetAccess, setStoredPet } = useStorageContext();
    const { vet: veterinarianData } = useVetContext();

    const [pet, setPet] = useState<PetType | null>(storedPet.id === petId ? storedPet : null);
    const [owner, setOwner] = useState<OwnerDataType | null>(null);
    const [basicData, setBasicData] = useState<BasicDataType | null>(null);
    const [vaccines, setVaccines] = useState<VaccineDataType[] | null>(null);
    const [medicines, setMedicines] = useState<MedicineDataType[] | null>(null);
    const [surgeries, setSurgeries] = useState<SurgeryDataType[] | null>(null);
    const [conditions, setConditions] = useState<ConditionDataType[] | null>(null);

    const [loadingPet, setLoadingPet] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (!petId) {
            setError("ID de mascota no encontrado en la ruta.");
            setLoadingPet(false);
            return;
        }

        const fetchAllPetData = async () => {
            try {
                // Fetch principal de la mascota
                if (!pet || pet.id !== petId) {
                    const petResponse = await getFetch(`/api/pets/${petId}`);
                    const petData = await petResponse.json();
                    if (!petResponse.ok) throw new Error(petData.message || "Mascota no encontrada");
                    setPet(petData);
                    setStoredPet(petData);
                }

                // Fetch de todos los datos relacionados para el resumen
                const [basicDataRes, vaccinesRes, medicinesRes, surgeriesRes, conditionsRes, ownerDataRes] = await Promise.all([
                    getFetch(`/api/pets/basic-data/${petId}`),
                    getFetch(`/api/pets/list/vaccines/${petId}`),
                    getFetch(`/api/pets/list/medicines/${petId}`),
                    getFetch(`/api/pets/list/surgeries/${petId}`),
                    getFetch(`/api/pets/list/conditions/${petId}`),
                    getFetch(`/api/owners/by-pet/${petId}`),
                ]);

                setBasicData(await basicDataRes.json());
                setVaccines(await vaccinesRes.json());
                setMedicines(await medicinesRes.json());
                setSurgeries(await surgeriesRes.json());
                setConditions(await conditionsRes.json());
                setOwner(await ownerDataRes.json());


            } catch (err) {
                console.error("Error fetching pet data:", err);
                setError(err instanceof Error ? err.message : "Error cargando datos de la mascota.");
            } finally {
                setLoadingPet(false);
            }
        };

        fetchAllPetData();
    }, [petId, setStoredPet, pet]);

    const handleFormSubmit = async (formData: CreateConsultationPayload) => {
        setSubmitting(true);
        setError(null);

        const payload: CreateConsultationPayload = { ...formData, pet_id: petId };

        if (veterinarianData?.vet_id && session?.user?.user_metadata?.role === 'veterinarian') {
            payload.veterinarian_id = veterinarianData.vet_id;
        } else if (storedVetAccess?.id) {
            payload.veterinary_access_id = storedVetAccess.id;
        } else {
            setError("No se pudo identificar al veterinario responsable. Inicie sesión o use un código de acceso válido.");
            setShowErrorModal(true);
            setSubmitting(false);
            return;
        }

        try {
            const response = await postFetch('/api/consultations', undefined, payload);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Error al guardar la consulta.");
            }

            const newConsultationId = result.consultation.id;

            // Si hay archivos, dispare su carga ahora que tenemos el ID
            if (formRef.current?.triggerFileUploads) {
                await formRef.current.triggerFileUploads(newConsultationId);
            }

            setShowSuccessModal(true);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido al guardar.");
            setShowErrorModal(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        router.push(`/pages/pet/consultations/${petId}`);
    }

    if (loadingPet) return <Loading />;
    if (error && !showErrorModal) return <DataNotFound message={error} />;
    if (!pet) return <DataNotFound message="Mascota no encontrada." />;

    return (
        <main style={{ padding: "2rem" }}>
            <Title icon={<FaClipboardList />} title={`Nueva Consulta para ${pet.name}`} />

            {showErrorModal && (
                <AlertModal title="Error" message={error || "Ocurrió un error inesperado."} type="warning" onClose={() => setShowErrorModal(false)} />
            )}
            {showSuccessModal && (
                <AlertModal title="Éxito" message="La consulta se ha guardado correctamente." type="info" onClose={handleSuccessModalClose} />
            )}

            <ConsultationPetSummary
                basicData={basicData}
                vaccines={vaccines}
                medicines={medicines}
                surgeries={surgeries}
                conditions={conditions}
            />

            <ConsultationForm
                ref={formRef}
                pet={pet}
                owner={owner}
                basicData={basicData}
                onSubmit={handleFormSubmit}
                isSubmitting={submitting}
            />
        </main>
    );
}