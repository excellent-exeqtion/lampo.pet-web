
// src/components/forms/LabTestForm.tsx
"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { v4 } from "uuid";
import { LabTestRepository } from '@/repos/labTest.repository';
import type { LabTestDataType } from '@/types/index';
import { PetStep } from '@/types/index';
import { Form } from '@/components/index';
import { Step } from '@/utils/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';

interface LabTestFormProps {
  petId: string;
  labTestsData: LabTestDataType[];
  setLabTestsData: (tests: LabTestDataType[]) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

const emptyLabTest = (petId: string): Partial<LabTestDataType> => ({
  id: v4(),
  pet_id: petId,
  name: "",
  type: "",
  date: undefined,
  result: "",
});

export default function LabTestForm({
  petId,
  labTestsData,
  setLabTestsData,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: LabTestFormProps) {
  const step = PetStep.LabTests;
  const entityName = 'prueba';
  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === step)?.state === state;

  const [tests, setTests] = useState<Partial<LabTestDataType>[]>(labTestsData);
  const [savedData, setSavedData] = useState<LabTestDataType[]>(labTestsData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (JSON.stringify(savedData) !== JSON.stringify(tests) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tests]);

  useEffect(() => {
    const load = async () => {
      if (stateEq(StepStateEnum.NotInitialize)) {
        const saved = await LabTestRepository.findByPet(petId);
        if (saved) {
          setSavedData(saved);
          setLabTestsData(saved);
          setTests(saved);
        }
        setState(StepStateEnum.Initialize);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleAdd = () => setTests(prev => [...prev, emptyLabTest(petId)]);

  const handleRemove = (id: string | undefined) => {
    if (id) LabTestRepository.delete(id);
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const handleChange = (
    i: number,
    field: keyof LabTestDataType,
    value: string | Date | undefined
  ) => {
    const list = tests.map((t, idx) => idx === i ? { ...t, [field]: value } : t);
    setTests(list);
    setState(StepStateEnum.Modified);
  };

  const handleSubmit = async () => {
    setError(null);
    for (let i = 0; i < tests.length; i++) {
      const t = tests[i];
      if (!t.name || !t.type) {
        setError(`La ${entityName} #${i + 1} requiere nombre y tipo.`);
        return;
      }
    }
    setLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const { error: saveErr } = await LabTestRepository.createAll(tests as LabTestDataType[]);
        if (saveErr) throw new Error(saveErr.message);
        setSavedData(tests as LabTestDataType[]);
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

  const form = (item: LabTestDataType, i: number) => (
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
        Tipo *
        <input
          type="text"
          value={item.type}
          onChange={e => handleChange(i, 'type', e.target.value)}
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
        Resultado
        <input
          type="text"
          value={item.result}
          onChange={e => handleChange(i, 'result', e.target.value)}
          className="w-full" />
      </label>
    </>
  );

  return (
    <Form
      entityList={tests}
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