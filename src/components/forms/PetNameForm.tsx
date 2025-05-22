// src/components/forms/BasicDataForm.tsx
import React, { Dispatch, useEffect, useState } from 'react';
import { PetRepository } from '@/repos/pet.repository';
import { generateUniquePetId } from '@/utils/random';
import { PetStep, PetType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';
import Steps from "../lib/steps";
import { Step } from '@/utils/index';
import { Empty } from '@/data/index';

interface PetFormProps {
  ownerId: string;
  pet: PetType;
  setPet: (name: PetType) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function PetNameForm({ ownerId, pet, setPet, onNext, onBack, stepStates, setStepStates }: PetFormProps) {
  const step = PetStep.Name;
  const setState = (stepState: StepStateEnum, stepError: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, stepState, stepError);
  }
  const stateEq = (stepState: StepStateEnum) => {
    return stepStates.find(x => x.number == step)?.state == stepState;
  }

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedData, setSavedData] = useState<PetType>(Empty.Pet());

  useEffect(() => {
    const fetch = async () => {
      if (stateEq(StepStateEnum.NotInitialize) && pet.id == '') {
        setState(StepStateEnum.Initialize);
      }
      if (stateEq(StepStateEnum.NotInitialize)) {
        const petSaved = await PetRepository.findById(pet.id);
        if (petSaved) {
          setPet(petSaved);
          setSavedData(petSaved);
        }
        setState(StepStateEnum.Initialize);
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  useEffect(() => {
    setState(StepStateEnum.Modified);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);


  useEffect(() => {
    if (JSON.stringify(savedData) != JSON.stringify(pet) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  // Paso 0: crear mascota
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log(stepStates);
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const newId = pet.id == '' ? await generateUniquePetId() : pet.id;
        const newPet = {
          id: newId,
          name: pet.name,
          image: pet.image,
          owner_id: ownerId,
        }
        const { error: petErr } = await PetRepository.create(newPet);
        if (petErr) throw new Error(petErr?.message || "Error creando mascota");
        setSavedData(newPet);
        setState(StepStateEnum.Saved);
        setPet(newPet);
      }
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setState(StepStateEnum.Error, err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Steps onBack={onBack} onNext={handleSubmit} loading={loading} step={step} error={error}>
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
      </div>
    </Steps>
  );
}
