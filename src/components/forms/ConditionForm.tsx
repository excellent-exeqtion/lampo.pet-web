// src/components/forms/ConditionForm.tsx
"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { v4 } from "uuid";
import { ConditionRepository } from '@/repos/condition.repository';
import type { ConditionDataType } from '@/types/index';
import { PetStep } from '@/types/index';
import { Form } from '@/components/index';
import { Step } from '@/utils/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';

interface ConditionFormProps {
  petId: string;
  conditionsData: ConditionDataType[];
  setConditionsData: (conditions: ConditionDataType[]) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

const emptyCondition = (petId: string): Partial<ConditionDataType> => ({
  id: v4(),
  pet_id: petId,
  condition: "",
  severity: "",
});

export default function ConditionForm({
  petId,
  conditionsData,
  setConditionsData,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: ConditionFormProps) {
  const step = PetStep.Conditions;
  const entityName = 'condición';
  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === step)?.state === state;

  const [conditions, setConditions] = useState<Partial<ConditionDataType>[]>(conditionsData);
  const [savedData, setSavedData] = useState<ConditionDataType[]>(conditionsData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (JSON.stringify(savedData) !== JSON.stringify(conditions) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditions]);

  useEffect(() => {
    const load = async () => {
      if (stateEq(StepStateEnum.NotInitialize)) {
        const saved = await ConditionRepository.findByPet(petId);
        if (saved) {
          setSavedData(saved);
          setConditionsData(saved);
          setConditions(saved);
        }
        setState(StepStateEnum.Initialize);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleAdd = () => setConditions(prev => [...prev, emptyCondition(petId)]);

  const handleRemove = (id: string | undefined) => {
    if (id) ConditionRepository.delete(id);
    setConditions(prev => prev.filter(c => c.id !== id));
  };

  const handleChange = (i: number, field: keyof ConditionDataType, value: string) => {
    const list = conditions.map((c, idx) => idx === i ? { ...c, [field]: value } : c);
    setConditions(list);
    setState(StepStateEnum.Modified);
  };

  const handleSubmit = async () => {
    setError(null);
    for (let i = 0; i < conditions.length; i++) {
      const c = conditions[i];
      if (!c.condition || !c.severity) {
        setError(`La ${entityName} #${i + 1} requiere condición y severidad.`);
        return;
      }
    }
    setLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const { error: saveErr } = await ConditionRepository.createAll(conditions as ConditionDataType[]);
        if (saveErr) throw new Error(saveErr.message);
        setSavedData(conditions as ConditionDataType[]);
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

  const form = (item: ConditionDataType, i: number) => (
    <>
      <label>
        Condición *
        <input
          type="text"
          value={item.condition}
          onChange={e => handleChange(i, 'condition', e.target.value)}
          required
          className="w-full"
        />
      </label>
      <label>
        Severidad *
        <input
          type="text"
          value={item.severity}
          onChange={e => handleChange(i, 'severity', e.target.value)}
          required
          className="w-full"
        />
      </label>
    </>
  );

  return (
    <Form
      entityList={conditions}
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