// src/hooks/useEntitySubmit.ts
"use client";

import { useState } from 'react';
import { StepStateEnum, StepsStateType } from '@/types/lib';
import { Step } from '@/utils/index';

export function useEntitySubmit<T>(
  entities: Partial<T>[],
  validateFn: (items: Partial<T>[]) => string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveFn: (items: T[]) => Promise<{ error?: any }>,
  stepNumber: number,
  stepStates: StepsStateType[],
  setStepStates: React.Dispatch<React.SetStateAction<StepsStateType[]>>
) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, stepNumber, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === stepNumber)?.state === state;

  const submit = async (onNext: () => void) => {
    const validationError = validateFn(entities);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (stateEq(StepStateEnum.Modified)) {
        const { error: saveErr } = await saveFn(entities as T[]);
        if (saveErr) throw new Error(saveErr.message);
        setState(StepStateEnum.Saved);
      }
      onNext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      setState(StepStateEnum.Error, err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, setError };
}