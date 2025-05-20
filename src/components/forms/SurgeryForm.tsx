
// src/components/forms/SurgeryForm.tsx
import React, { useState } from 'react';
import { SurgeryRepository } from '@/repos/surgery.repository';
import type { SurgeryDataType } from '@/types/index';

interface SurgeryFormProps {
  petId: string;
  onNext: () => void;
}

export function SurgeryForm({ petId, onNext }: SurgeryFormProps) {
  const [data, setData] = useState<Partial<SurgeryDataType>>({ pet_id: petId, name: '', date: undefined, description: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError(null);
    setLoading(true);
    try {
      await SurgeryRepository.create(data as SurgeryDataType);
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
        Fecha
        <input
          type="date"
          onChange={e => setData({ ...data, date: e.target.valueAsDate || undefined })}
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

      {error && <p className="text-error">{error}</p>}
      <button type="button" onClick={handleNext} disabled={loading}>
        {loading ? 'Guardando…' : 'Siguiente'}
      </button>
    </div>
  );
}
