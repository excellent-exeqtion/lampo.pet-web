// src/components/consultations/ConsultationPetSummary.tsx
import React from 'react';
import { BasicDataType, VaccineDataType, MedicineDataType, SurgeryDataType, ConditionDataType } from '@/types/index';
import { Dates } from '@/utils/index';
import { FaExclamationTriangle, FaStethoscope, FaSyringe, FaPills, FaCut, FaHeartbeat } from 'react-icons/fa';

interface SummaryProps {
    basicData: BasicDataType | null;
    vaccines: VaccineDataType[] | null;
    medicines: MedicineDataType[] | null;
    surgeries: SurgeryDataType[] | null;
    conditions: ConditionDataType[] | null;
}

const SummaryItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; show?: boolean }> = ({ icon, label, value, show = true }) => {
    if (!show || !value) return null;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--pico-primary)' }}>{icon}</span>
            <strong>{label}:</strong>
            <span>{value}</span>
        </div>
    );
};

export default function ConsultationPetSummary({ basicData, vaccines, medicines, surgeries, conditions }: SummaryProps) {
    if (!basicData) return null;

    return (
        <details style={{ marginBottom: '2rem' }} open>
            <summary role="button" className="outline">Resumen de la Mascota</summary>
            <div style={{ padding: '1rem', border: '1px solid var(--pico-secondary)', borderRadius: '4px', marginTop: '0.5rem' }}>
                <SummaryItem icon={<FaExclamationTriangle />} label="Alergias" value={basicData.has_allergies ? 'Sí' : 'No'} />
                <SummaryItem icon={<FaStethoscope />} label="Condiciones Especiales" value={basicData.special_condition ? 'Sí' : 'No'} />
                {conditions && conditions.length > 0 && (
                    <SummaryItem
                        icon={<FaHeartbeat />}
                        label="Condiciones Listadas"
                        value={conditions.map(c => `${c.condition} (${c.severity})`).join(', ')}
                    />
                )}
                <SummaryItem
                    icon={<FaSyringe />}
                    label="Última Vacuna"
                    value={basicData.has_vaccine ? `${basicData.last_vaccine_name} el ${Dates.format(basicData.last_vaccine_date)}` : 'Ninguna registrada'}
                />
                {vaccines && vaccines.length > 1 && (
                    <SummaryItem
                        icon={<FaSyringe />}
                        label="Vacunas Anteriores"
                        show={vaccines.length > 1}
                        value={`${vaccines.length - 1} más registradas`}
                    />
                )}
                <SummaryItem
                    icon={<FaPills />}
                    label="Usa Medicamentos"
                    value={basicData.uses_medicine ? 'Sí' : 'No'}
                />
                {medicines && medicines.length > 0 && (
                    <SummaryItem
                        icon={<FaPills />}
                        label="Medicamentos Listados"
                        value={medicines.map(m => m.name).join(', ')}
                    />
                )}
                {surgeries && surgeries.length > 0 && (
                    <SummaryItem
                        icon={<FaCut />}
                        label="Cirugías Previas"
                        value={surgeries.map(s => `${s.name} el ${Dates.format(s.date)}`).join('; ')}
                    />
                )}
            </div>
        </details>
    );
}