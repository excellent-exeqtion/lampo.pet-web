
// src/hooks/useLoadEntities.ts
"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Steps } from '@/utils/index';
import { ApiError, StepStateEnum, StepsStateType } from '@/types/lib';
import { getFetch } from '@/app/api';

export function useLoadEntities<T>(
    id: string,
    entityName: string,
    storedList: T[],
    setStoredList: (list: T[]) => void,
    initialData: T[],
    setDataCallback: (data: T[]) => void,
    stepNumber: number,
    stepStates: StepsStateType[],
    setStepStates: Dispatch<SetStateAction<StepsStateType[]>>
) {
    const [list, setList] = useState<Partial<T>[]>(initialData);
    const [savedData, setSavedData] = useState<T[]>(initialData);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const setState = (state: StepStateEnum, err: string | null = null) => {
        Steps.ChangeState(stepStates, setStepStates, stepNumber, state, err);
    };
    const stateEq = (state: StepStateEnum) =>
        stepStates.find(x => x.step === stepNumber)?.state === state;
    const getUrl = () =>
        stepStates.find(x=> x.step == stepNumber)?.url;

    useEffect(() => {
        const fetch = async () => {
            if (stateEq(StepStateEnum.NotInitialize)) {
                setState(StepStateEnum.Initialize);
                let saved: T[] = [];
                if (storedList.length == 0) {
                    const response = await getFetch(`${getUrl()}}${id}`);
                    if(!response.ok) throw new ApiError(`Fallo al obtener información de ${entityName}`);
                    setStoredList(saved);
                }
                else {
                    saved = storedList;
                }
                if (saved) {
                    setSavedData(saved);
                    setDataCallback(saved);
                    setList(saved);
                }
            }
            setLoading(false);
        }
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (JSON.stringify(savedData) !== JSON.stringify(list) && !stateEq(StepStateEnum.NotInitialize) && loading == false) {
            setState(StepStateEnum.Modified);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [list]);

    return { list, setList, error, setError, loading, setState, stateEq };
}
