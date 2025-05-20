// src/components/forms/BasicDataForm.tsx
import React, { useState } from 'react';
import { BasicDataRepository } from '@/repos/basicData.repository';
import type { BasicDataType } from '@/types/index';

interface BasicDataFormProps {
  petId: string;
  onNext: () => void;
}

export function BasicDataForm({ petId, onNext }: BasicDataFormProps) {
  const [formData, setFormData] = useState<Partial<BasicDataType>>({
    pet_id: petId,
    pet_type: '',
    gender: '',
    weight: '',
    race: '',
    has_allergies: false,
    weight_condition: '',
    size: '',
    lives_with_others: false,
    main_food: '',
    has_vaccine: false,
    last_vaccine_name: '',
    last_vaccine_date: undefined,
    is_castrated: false,
    castration_date: undefined,
    has_anti_flea: false,
    anti_flea_date: undefined,
    uses_medicine: false,
    special_condition: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError(null);
    setLoading(true);
    try {
      await BasicDataRepository.create(formData as BasicDataType);
      onNext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[1000px] mx-auto grid grid-cols-2 gap-4">
      <label>
        Tipo
        <input
          type="text"
          value={formData.pet_type}
          onChange={e => setFormData({ ...formData, pet_type: e.target.value })}
          required
        />
      </label>
      <label>
        Género
        <input
          type="text"
          value={formData.gender}
          onChange={e => setFormData({ ...formData, gender: e.target.value })}
          required
        />
      </label>
      <label>
        Peso
        <input
          type="text"
          value={formData.weight}
          onChange={e => setFormData({ ...formData, weight: e.target.value })}
          required
        />
      </label>
      <label>
        Raza
        <input
          type="text"
          value={formData.race}
          onChange={e => setFormData({ ...formData, race: e.target.value })}
          required
        />
      </label>
      <label>
        ¿Alergias?
        <input
          type="checkbox"
          checked={formData.has_allergies}
          onChange={e => setFormData({ ...formData, has_allergies: e.target.checked })}
        />
      </label>
      <label>
        Condición de peso
        <input
          type="text"
          value={formData.weight_condition}
          onChange={e => setFormData({ ...formData, weight_condition: e.target.value })}
        />
      </label>
      <label>
        Tamaño
        <input
          type="text"
          value={formData.size}
          onChange={e => setFormData({ ...formData, size: e.target.value })}
        />
      </label>
      <label>
        ¿Vive con otros?
        <input
          type="checkbox"
          checked={formData.lives_with_others}
          onChange={e => setFormData({ ...formData, lives_with_others: e.target.checked })}
        />
      </label>
      <label>
        Comida principal
        <input
          type="text"
          value={formData.main_food}
          onChange={e => setFormData({ ...formData, main_food: e.target.value })}
        />
      </label>
      <label>
        ¿Tiene vacunas?
        <input
          type="checkbox"
          checked={formData.has_vaccine}
          onChange={e => setFormData({ ...formData, has_vaccine: e.target.checked })}
        />
      </label>
      <label>
        Nombre última vacuna
        <input
          type="text"
          value={formData.last_vaccine_name || ''}
          onChange={e => setFormData({ ...formData, last_vaccine_name: e.target.value })}
        />
      </label>
      <label>
        Fecha última vacuna
        <input
          type="date"
          onChange={e => setFormData({ ...formData, last_vaccine_date: e.target.valueAsDate || undefined })}
        />
      </label>
      <label>
        ¿Castrado?
        <input
          type="checkbox"
          checked={formData.is_castrated}
          onChange={e => setFormData({ ...formData, is_castrated: e.target.checked })}
        />
      </label>
      <label>
        Fecha de castración
        <input
          type="date"
          onChange={e => setFormData({ ...formData, castration_date: e.target.valueAsDate || undefined })}
        />
      </label>
      <label>
        ¿Antipulgas?
        <input
          type="checkbox"
          checked={formData.has_anti_flea}
          onChange={e => setFormData({ ...formData, has_anti_flea: e.target.checked })}
        />
      </label>
      <label>
        Fecha antipulgas
        <input
          type="date"
          onChange={e => setFormData({ ...formData, anti_flea_date: e.target.valueAsDate || undefined })}
        />
      </label>
      <label>
        ¿Usa medicina?
        <input
          type="checkbox"
          checked={formData.uses_medicine}
          onChange={e => setFormData({ ...formData, uses_medicine: e.target.checked })}
        />
      </label>
      <label>
        ¿Condición especial?
        <input
          type="checkbox"
          checked={formData.special_condition}
          onChange={e => setFormData({ ...formData, special_condition: e.target.checked })}
        />
      </label>

      {error && <p className="text-error">{error}</p>}
      <button type="button" onClick={handleNext} disabled={loading}>
        {loading ? 'Guardando…' : 'Siguiente'}
      </button>
    </div>
  );
}
