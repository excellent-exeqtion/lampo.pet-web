// RUTA: src/app/pages/vet/settings/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { FaCog, FaSpinner } from 'react-icons/fa';
import { Title, Loading } from '@/components/index';
import { useVetContext } from '@/context/VetContext';
import { VeterinarianType } from '@/types/index';
import { putFetch } from '@/app/api';

export default function VetSettingsPage() {
    const { vet, loading: loadingVet, refresh: refreshVet } = useVetContext();
    const [vetInfo, setVetInfo] = useState<Partial<VeterinarianType>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (vet) {
            setVetInfo(vet);
        }
    }, [vet]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVetInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        if (!vetInfo.vet_id) {
            setError("No se puede identificar al veterinario.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await putFetch(`/api/vet/${vetInfo.vet_id}`, undefined, vetInfo);
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error al actualizar los datos.');
            }

            setSuccessMessage('¡Datos actualizados correctamente!');
            await refreshVet(); // Refrescar el contexto con los nuevos datos

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingVet) {
        return <Loading />;
    }

    if (!vet) {
        return <p>No se pudo cargar la información del veterinario.</p>;
    }

    return (
        <main style={{ padding: '2rem' }}>
            <Title icon={<FaCog />} title="Configuración de Perfil de Veterinario" />
            <p>Aquí puedes actualizar tu información profesional que se mostrará en las historias clínicas.</p>

            <form onSubmit={handleSubmit} style={{ marginTop: '2rem', maxWidth: '700px' }}>
                <fieldset disabled={isSubmitting}>
                    <div className="grid">
                        <label htmlFor="first_name">
                            Nombre
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={vetInfo.first_name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label htmlFor="last_name">
                            Apellido
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={vetInfo.last_name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>

                    <label htmlFor="email">
                        Email (no se puede cambiar)
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={vetInfo.email || ''}
                            readOnly
                            disabled
                        />
                    </label>

                    <div className="grid">
                        <label htmlFor="registration">
                            Matrícula Profesional
                            <input
                                type="text"
                                id="registration"
                                name="registration"
                                value={vetInfo.registration || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                        <label htmlFor="clinic_name">
                            Nombre de la Clínica/Hospital
                            <input
                                type="text"
                                id="clinic_name"
                                name="clinic_name"
                                value={vetInfo.clinic_name || ''}
                                onChange={handleInputChange}
                                required
                            />
                        </label>
                    </div>

                    <label htmlFor="city">
                        Ciudad
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={vetInfo.city || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </label>

                    {error && <p role="alert" style={{ color: "var(--pico-form-element-invalid-active-border-color, red)" }}>{error}</p>}
                    {successMessage && <p role="status" style={{ color: "var(--pico-color-green-500, green)" }}>{successMessage}</p>}

                    <button type="submit" aria-busy={isSubmitting}>
                        {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Guardar Cambios'}
                    </button>
                </fieldset>
            </form>
        </main>
    );
}