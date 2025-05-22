// src/hooks/useEntitySubmit.ts
"use client";

import { Dispatch, SetStateAction } from 'react';
import { StepStateEnum, StepsStateType } from '@/types/lib';
import { Step, Validations } from '@/utils/index';
import { FieldConfig } from '../types/lib/index';

export function useEntitySubmit<T>(
  entities: Partial<T>[],
  fieldConfig: FieldConfig<T>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveFn: (items: T[]) => Promise<{ error?: any }>,
  stepNumber: number,
  stepStates: StepsStateType[],
  setStepStates: React.Dispatch<React.SetStateAction<StepsStateType[]>>,
  error: string | null,
  setError: Dispatch<SetStateAction<string | null>>,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>
) {
  setLoading(false);

  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, stepNumber, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === stepNumber)?.state === state;

  const submit = async (onNext: () => void) => {
    const validationError = Validations.forFields(entities, fieldConfig);
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

  return { submit, loading, error };
}