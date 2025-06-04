// src/app/pages/pet/consultations/[petId]/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PetType, ConsultationType } from '@/types/index';
import { getFetch } from '@/app/api';
import { Loading, DataNotFound, Title } from '@/components/index';
import { ConsultationDetailView } from '@/components/index';
import { FaNotesMedical, FaListAlt, FaArrowLeft } from 'react-icons/fa';
import { useStorageContext } from '@/context/StorageProvider';
import { useSessionContext } from '@/context/SessionProvider'; // Para verificar el veterinario logueado
import { Dates } from '@/utils/index';
import { useRoleContext } from '@/context/RoleProvider';

export default function PetConsultationsPage() {
    const params = useParams();
    const router = useRouter();
    const petId = params.petId as string;

    const { storedPet, setStoredPet } = useStorageContext();
    const { db: session } = useSessionContext(); // Usuario autenticado
    const { isOwner } = useRoleContext();

    const [pet, setPet] = useState<PetType | null>(storedPet.id === petId ? storedPet : null);
    const [consultations, setConsultations] = useState<ConsultationType[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!petId) {
            setError("ID de mascota no proporcionado.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Cargar datos de la mascota si no están en el contexto o son diferentes
                if (!pet || pet.id !== petId) {
                    const petResponse = await getFetch(`/api/pets/${petId}`);
                    const petData = await petResponse.json();
                    if (!petResponse.ok || !petData) {
                        throw new Error(petData?.message || 'Mascota no encontrada');
                    }
                    setPet(petData);
                    setStoredPet(petData); // Actualizar contexto
                }

                // Cargar consultas
                const consultsResponse = await getFetch(`/api/consultations?petId=${petId}`);
                const consultsData = await consultsResponse.json();
                if (!consultsResponse.ok || !consultsData.success) {
                    throw new Error(consultsData?.message || 'Error cargando consultas');
                }
                setConsultations(consultsData.consultations || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido al cargar datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, storedPet, setStoredPet]); // pet no es dependencia para evitar bucle si se actualiza dentro

    const handleSelectConsultation = (consultation: ConsultationType) => {
        setSelectedConsultation(consultation);
    };

    const handleBackToList = () => {
        setSelectedConsultation(null);
    };

    // Función para recargar los datos de la consulta seleccionada (útil después de añadir un archivo)
    const refreshSelectedConsultation = async () => {
        if (!selectedConsultation?.id) return;
        try {
            const response = await getFetch(`/api/consultations/${selectedConsultation.id}`);
            const result = await response.json();
            if (response.ok && result.success) {
                setSelectedConsultation(result.consultation);
                // Actualizar la lista general también
                setConsultations(prev => prev.map(c => c.id === result.consultation.id ? result.consultation : c));
            } else {
                console.error("Error recargando consulta:", result.message);
            }
        } catch (err) {
            console.error("Error recargando consulta:", err);
        }
    };


    if (loading) return <Loading />;
    if (error) return <DataNotFound message={error} />;
    if (!pet) return <DataNotFound message="Mascota no encontrada." />;

    return (
        <main style={{ padding: "2rem" }}>
            <Title
                icon={<FaNotesMedical />}
                title={selectedConsultation
                    ? `Detalle Consulta (${Dates.format(selectedConsultation.consultation_date)}) para ${pet.name}`
                    : `Historial de Consultas para ${pet.name}`}
            />

            {selectedConsultation ? (
                <div>
                    <button onClick={handleBackToList} className="outline secondary" style={{ marginBottom: '1rem' }}>
                        <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Volver al Listado
                    </button>
                    <ConsultationDetailView
                        consultation={selectedConsultation}
                        currentUserId={session?.user?.id || null} // Para lógica de edición/añadir archivos
                        onFileAdded={refreshSelectedConsultation} // Callback para refrescar después de añadir archivo
                    />
                </div>
            ) : (
                <>
                    {consultations.length === 0 ? (
                        <DataNotFound message="No hay consultas registradas para esta mascota." />
                    ) : (
                        <div role="list" style={{ marginTop: '1rem' }}>
                            {consultations.map((consult) => (
                                <article
                                    key={consult.id}
                                    onClick={() => handleSelectConsultation(consult)}
                                    role="listitem"
                                    style={{
                                        marginBottom: '1rem',
                                        cursor: 'pointer',
                                        borderLeft: '5px solid var(--primary)'
                                    }}
                                    className="pico-paper" // Usar alguna clase de Pico para el estilo de "papel"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <strong>Motivo: {consult.reason_for_consultation.substring(0, 50)}{consult.reason_for_consultation.length > 50 ? '...' : ''}</strong>
                                        <span>{Dates.format(consult.consultation_date)} {consult.consultation_time}</span>
                                    </div>
                                    <small>HC#: {consult.hc_number || 'N/A'} - Institución: {consult.institution_name || 'N/A'}</small>
                                </article>
                            ))}
                        </div>
                    )}
                    {!isOwner &&
                        <button
                            onClick={() => router.push(`/pages/vet/consultation/${petId}`)}
                            style={{ marginTop: '1.5rem' }}
                        >
                            <FaListAlt style={{ marginRight: '0.5rem' }} /> Agregar Nueva Consulta
                        </button>
                    }
                </>
            )}
        </main>
    );
}