
// src/hooks/useLoadEntities.ts
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Step } from '@/utils/index';
import { FormRepository, StepStateEnum, StepsStateType } from '@/types/lib';

export function useLoadEntities<T>(
  repository: FormRepository<T>,
  petId: string,
  initialData: T[],
  setDataCallback: (data: T[]) => void,
  stepNumber: number,
  stepStates: StepsStateType[],
  setStepStates: Dispatch<SetStateAction<StepsStateType[]>>
) {
  const [list, setList] = useState<Partial<T>[]>(initialData);
  const [savedData, setSavedData] = useState<T[]>(initialData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setState = (state: StepStateEnum, err: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, stepNumber, state, err);
  };
  const stateEq = (state: StepStateEnum) =>
    stepStates.find(x => x.number === stepNumber)?.state === state;

  useEffect(() => {
    if (stateEq(StepStateEnum.NotInitialize)) {
      (async () => {
        const saved = await repository.findByParentId(petId);
        if (saved) {
          setSavedData(saved);
          setDataCallback(saved);
          setList(saved);
        }
        setState(StepStateEnum.Initialize);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  useEffect(() => {
    if (JSON.stringify(savedData) !== JSON.stringify(list) && !stateEq(StepStateEnum.NotInitialize)) {
      setState(StepStateEnum.Modified);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return { list, setList, error, setError, loading, setLoading, setState, stateEq };
}
