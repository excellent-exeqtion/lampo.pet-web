// src/components/forms/BasicDataForm.tsx
import React, { Dispatch, useState } from 'react';
import { PetRepository } from '@/repos/pet.repository';
import { generateUniquePetId } from '@/utils/random';
import { Steps } from '@/utils/index';
import { PetStep, PetType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';

interface PetFormProps {
  ownerId: string;
  pet: PetType;
  setPet: (name: PetType) => void;
  onNext: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function PetNameForm({ ownerId, pet, setPet, onNext, stepStates, setStepStates }: PetFormProps) {

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Paso 0: crear mascota
  const handleCreatePet = async () => {
    setError(null);
    setLoading(true);
    try {
      if (stepStates.find(s => s.number == PetStep.Name)?.state != StepStateEnum.Saved) {
        const newId = await generateUniquePetId();
        const newPet = {
          id: newId,
          name: pet.name,
          image: pet.image,
          owner_id: ownerId,
        }
        const { error: petErr } = await PetRepository.create(newPet);
        if (petErr) throw new Error(petErr?.message || "Error creando mascota");
        Steps.ChangeState(stepStates, setStepStates, PetStep.Name, StepStateEnum.Saved);
        setPet(newPet);
      }
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Steps.ChangeState(stepStates, setStepStates, PetStep.Name, StepStateEnum.Error, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4" style={{ display: 'flow' }}>
      <label>
        Nombre
        <input
          type="text"
          value={pet.name}
          onChange={(e) => setPet({ ...pet, name: e.target.value })}
          required
        />
      </label>
      <label>
        URL de imagen
        <input
          type="text"
          value={pet.image ?? "/pets/pet.png"}
          onChange={(e) => setPet({ ...pet, image: e.target.value })}
        />
      </label>
      {error && <p className="text-error">{error}</p>}
      <button
        type="button"
        onClick={handleCreatePet}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? "Creando…" : "Siguiente"}
      </button>
    </div>
  );
}
