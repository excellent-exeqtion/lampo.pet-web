
// src/components/forms/MedicineForm.tsx
import React, { useState } from 'react';
import { MedicineRepository } from '@/repos/medicine.repository';
import type { MedicineDataType } from '@/types/index';

interface MedicineFormProps {
    petId: string;
    onNext: () => void;
}

export function MedicineForm({ petId, onNext }: MedicineFormProps) {
    const [data, setData] = useState<Partial<MedicineDataType>>({ pet_id: petId, name: '', dosage: '', frequency: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        setError(null);
        setLoading(true);
        try {
            await MedicineRepository.create(data as MedicineDataType);
            onNext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <label>
                Nombre
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    required
                />
            </label>
            <label>
                Dosis
                <input
                    type="text"
                    value={data.dosage}
                    onChange={e => setData({ ...data, dosage: e.target.value })}
                    required
                />
            </label>
            <label>
                Frecuencia
                <input
                    type="text"
                    value={data.frequency}
                    onChange={e => setData({ ...data, frequency: e.target.value })}
                    required
                />
            </label>

            {error && <p className="text-error">{error}</p>}
            <button type="button" onClick={handleNext} disabled={loading}>
                {loading ? 'Guardando…' : 'Siguiente'}
            </button>
        </div>
    );
}