// src/hooks/useEntitySubmit.ts
"use client";

import { Dispatch, SetStateAction, useState } from 'react';
import { ApiError, StepStateEnum, StepsStateType } from '@/types/lib';
import { Steps, Validations } from '@/utils/index';
import { FieldConfig } from '../types/lib/index';
import { postFetch } from '@/app/api';

export function useEntitySubmit<T>(
    id: string,
    entities: Partial<T>[],
    entityName: string,
    setStoredList: (list: T[]) => void,
    setDataCallback: (data: T[]) => void,
    fieldConfig: FieldConfig<T>[],
    stepNumber: number,
    stepStates: StepsStateType[],
    setStepStates: React.Dispatch<React.SetStateAction<StepsStateType[]>>,
    error: string | null,
    setError: Dispatch<SetStateAction<string | null>>
) {
    const [submitting, setSubmitting] = useState(false);

    const setState = (state: StepStateEnum, err: string | null = null) => {
        Steps.ChangeState(stepStates, setStepStates, stepNumber, state, err);
    };
    const stateEq = (state: StepStateEnum) =>
        stepStates.find(x => x.step === stepNumber)?.state === state;
    const getUrl = () =>
        stepStates.find(x => x.step === stepNumber)?.url;

    const submit = async (onNext: () => void) => {
        setSubmitting(false);
        const validationError = Validations.forFields(entities, entityName, fieldConfig);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        try {
            if (stateEq(StepStateEnum.Modified)) {
                if (entities.length > 0) {
                    const basicDataResponse = await postFetch(`${getUrl()}${id}`, undefined, entities);
                    if (!basicDataResponse.ok) throw new ApiError(`Error actualizado ${entityName}.`);
                    setDataCallback(entities as T[]);
                    setStoredList(entities as T[]);
                }
                setState(StepStateEnum.Saved);
            }
            onNext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
            setState(StepStateEnum.Error, err.message);
        } finally {
            setSubmitting(true);
        }
    };

    return { submit, loading: submitting, error };
}