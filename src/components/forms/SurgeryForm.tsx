
// src/components/forms/SurgeryForm.tsx
"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { v4 } from "uuid";
import { SurgeryRepository } from '@/repos/surgery.repository';
import type { SurgeryDataType } from '@/types/index';
import { PetStep } from '@/types/index';
import { Form } from '@/components/index';
import { Step } from '@/utils/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';

interface SurgeryFormProps {
  petId: string;
  surgeriesData: SurgeryDataType[];
  setSurgeriesData: (s: SurgeryDataType[]) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

const emptySurgery = (petId: string): Partial<SurgeryDataType> => ({
  id: v4(),
  pet_id: petId,
  name: "",
  date: undefined,
  description: "",
});

export default function SurgeryForm({
  petId,
  surgeriesData,
  setSurgeriesData,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: SurgeryFormProps) {
  const step = PetStep.Surgeries;
  const entityName = 'cirugía';
  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === step)?.state === state;

  const [surgeries, setSurgeries] = useState<Partial<SurgeryDataType>[]>(surgeriesData);
  const [savedData, setSavedData] = useState<SurgeryDataType[]>(surgeriesData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (JSON.stringify(savedData) !== JSON.stringify(surgeries) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surgeries]);

  useEffect(() => {
    const load = async () => {
      if (stateEq(StepStateEnum.NotInitialize)) {
        const saved = await SurgeryRepository.findByPet(petId);
        if (saved) {
          setSavedData(saved);
          setSurgeriesData(saved);
          setSurgeries(saved);
        }
        setState(StepStateEnum.Initialize);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleAdd = () => setSurgeries(prev => [...prev, emptySurgery(petId)]);

  const handleRemove = (id: string | undefined) => {
    if (id) SurgeryRepository.delete(id);
    setSurgeries(prev => prev.filter(s => s.id !== id));
  };

  const handleChange = (
    i: number,
    field: keyof SurgeryDataType,
    value: string | Date | undefined
  ) => {
    const list = surgeries.map((s, idx) => idx === i ? { ...s, [field]: value } : s);
    setSurgeries(list);
    setState(StepStateEnum.Modified);
  };

  const handleSubmit = async () => {
    setError(null);
    for (let i = 0; i < surgeries.length; i++) {
      const s = surgeries[i];
      if (!s.name) {
        setError(`La ${entityName} #${i + 1} requiere nombre.`);
        return;
      }
    }
    setLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const { error: saveErr } = await SurgeryRepository.createAll(surgeries as SurgeryDataType[]);
        if (saveErr) throw new Error(saveErr.message);
        setSavedData(surgeries as SurgeryDataType[]);
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

  const form = (item: SurgeryDataType, i: number) => (
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
        Fecha
        <input
          type="date"
          value={item.date ? (item.date as Date).toISOString().substr(0,10) : ''}
          onChange={e => handleChange(i, 'date', e.target.valueAsDate || undefined)}
          className="w-full" />
      </label>
      <label>
        Descripción
        <input
          type="text"
          value={item.description}
          onChange={e => handleChange(i, 'description', e.target.value)}
          className="w-full" />
      </label>
    </>
  );

  return (
    <Form
      entityList={surgeries}
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
