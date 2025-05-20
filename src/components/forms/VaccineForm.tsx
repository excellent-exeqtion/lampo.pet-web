
// src/components/forms/VaccineForm.tsx
import React, { useState } from 'react';
import { VaccineRepository } from '@/repos/vaccine.repository';
import type { VaccineDataType } from '@/types/index';

interface VaccineFormProps {
    petId: string;
    onNext: () => void;
}

export function VaccineForm({ petId, onNext }: VaccineFormProps) {
    const [data, setData] = useState<Partial<VaccineDataType>>({
        pet_id: petId,
        name: '',
        description: '',
        date: undefined,
        batch: '',
        brand: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        setError(null);
        setLoading(true);
        try {
            await VaccineRepository.create(data as VaccineDataType);
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
                Descripción
                <input
                    type="text"
                    value={data.description || ''}
                    onChange={e => setData({ ...data, description: e.target.value })}
                />
            </label>
            <label>
                Fecha
                <input
                    type="date"
                    onChange={e => setData({ ...data, date: e.target.valueAsDate || undefined })}
                />
            </label>
            <label>
                Lote
                <input
                    type="text"
                    value={data.batch}
                    onChange={e => setData({ ...data, batch: e.target.value })}
                    required
                />
            </label>
            <label>
                Marca
                <input
                    type="text"
                    value={data.brand}
                    onChange={e => setData({ ...data, brand: e.target.value })}
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