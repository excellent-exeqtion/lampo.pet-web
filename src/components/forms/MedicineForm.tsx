// src/components/forms/MedicineForm.tsx
"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { v4 } from "uuid";
import { MedicineRepository } from '@/repos/medicine.repository';
import type { MedicineDataType } from '@/types/index';
import { PetStep } from '@/types/index';
import { Form } from '@/components/index';
import { Step } from '@/utils/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';

interface MedicineFormProps {
  petId: string;
  medicinesData: MedicineDataType[];
  setMedicinesData: (meds: MedicineDataType[]) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

const emptyMedicine = (petId: string): Partial<MedicineDataType> => ({
  id: v4(),
  pet_id: petId,
  name: "",
  dosage: "",
  frequency: "",
});

export default function MedicineForm({
  petId,
  medicinesData,
  setMedicinesData,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: MedicineFormProps) {
  const step = PetStep.Medicines;
  const entityName = 'medicina';
  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === step)?.state === state;

  const [meds, setMeds] = useState<Partial<MedicineDataType>[]>(medicinesData);
  const [savedData, setSavedData] = useState<MedicineDataType[]>(medicinesData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (JSON.stringify(savedData) !== JSON.stringify(meds) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meds]);

  useEffect(() => {
    const load = async () => {
      if (stateEq(StepStateEnum.NotInitialize)) {
        const saved = await MedicineRepository.findByPet(petId);
        if (saved) {
          setSavedData(saved);
          setMedicinesData(saved);
          setMeds(saved);
        }
        setState(StepStateEnum.Initialize);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleAdd = () => setMeds(prev => [...prev, emptyMedicine(petId)]);

  const handleRemove = (id: string | undefined) => {
    if (id) MedicineRepository.delete(id);
    setMeds(prev => prev.filter(m => m.id !== id));
  };

  const handleChange = (i: number, field: keyof MedicineDataType, value: string) => {
    const list = meds.map((m, idx) => idx === i ? { ...m, [field]: value } : m);
    setMeds(list);
    setState(StepStateEnum.Modified);
  };

  const handleSubmit = async () => {
    setError(null);
    for (let i = 0; i < meds.length; i++) {
      const m = meds[i];
      if (!m.name || !m.dosage || !m.frequency) {
        setError(`La ${entityName} #${i + 1} requiere nombre, dosis y frecuencia.`);
        return;
      }
    }
    setLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const { error: saveErr } = await MedicineRepository.createAll(meds as MedicineDataType[]);
        if (saveErr) throw new Error(saveErr.message);
        setSavedData(meds as MedicineDataType[]);
        setState(StepStateEnum.Saved);
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

  const form = (item: MedicineDataType, i: number) => (
    <>
      <label>
        Nombre *
        <input
          type="text"
          value={item.name}
          onChange={e => handleChange(i, 'name', e.target.value)}
          required
          className="w-full" />
      </label>
      <label>
        Dosis *
        <input
          type="text"
          value={item.dosage}
          onChange={e => handleChange(i, 'dosage', e.target.value)}
          required
          className="w-full" />
      </label>
      <label>
        Frecuencia *
        <input
          type="text"
          value={item.frequency}
          onChange={e => handleChange(i, 'frequency', e.target.value)}
          required
          className="w-full" />
      </label>
    </>
  );

  return (
    <Form
      entityList={meds}
      step={step}
      entityName={entityName}
      loading={loading}
      error={error}
      form={form}
      onBack={onBack}
      handleAdd={handleAdd}
      handleRemove={handleRemove}
      handleSubmit={handleSubmit}
    />
  );
}