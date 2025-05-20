
// src/components/forms/ConditionForm.tsx
import React, { useState } from 'react';
import { ConditionRepository } from '@/repos/condition.repository';
import type { ConditionDataType } from '@/types/index';

interface ConditionFormProps {
  petId: string;
  onNext: () => void;
}

export default function ConditionForm({ petId, onNext }: ConditionFormProps) {
  const [data, setData] = useState<Partial<ConditionDataType>>({ pet_id: petId, condition: '', severity: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError(null);
    setLoading(true);
    try {
      await ConditionRepository.create(data as ConditionDataType);
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
        Condición
        <input
          type="text"
          value={data.condition}
          onChange={e => setData({ ...data, condition: e.target.value })}
          required
        />
      </label>
      <label>
        Severidad
        <input
          type="text"
          value={data.severity}
          onChange={e => setData({ ...data, severity: e.target.value })}
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