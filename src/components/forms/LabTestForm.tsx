
// src/components/forms/LabTestForm.tsx
import React, { useState } from 'react';
import { LabTestRepository } from '@/repos/labTest.repository';
import type { LabTestDataType } from '@/types/index';

interface LabTestFormProps {
  petId: string;
  onNext: () => void;
}

export default function LabTestForm({ petId, onNext }: LabTestFormProps) {
  const [data, setData] = useState<Partial<LabTestDataType>>({ pet_id: petId, name: '', type: '', date: undefined, result: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError(null);
    setLoading(true);
    try {
      await LabTestRepository.create(data as LabTestDataType);
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
        Tipo
        <input
          type="text"
          value={data.type}
          onChange={e => setData({ ...data, type: e.target.value })}
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
        Resultado
        <input
          type="text"
          value={data.result || ''}
          onChange={e => setData({ ...data, result: e.target.value })}
        />
      </label>

      {error && <p className="text-error">{error}</p>}
      <button type="button" onClick={handleNext} disabled={loading}>
        {loading ? 'Guardando…' : 'Siguiente'}
      </button>
    </div>
  );
}
