// src/hooks/useEntityList.ts
"use client";

import { deleteFetch } from '@/services/apiService';
import { ApiError, StepsStateType } from '@/types/lib';
import { Dispatch, SetStateAction } from 'react';

export function useEntityList<T extends { id: string | undefined }>(
    emptyFactory: (id: string) => Partial<T>,
    id: string,
    setList: Dispatch<SetStateAction<Partial<T>[]>>,
    setError: Dispatch<SetStateAction<string | null>>,
    stepNumber: number,
    stepStates: StepsStateType[]
) {
    const addItem = () => setList(prev => [...prev, emptyFactory(id)]);
    const removeItem = (id?: string) => {
        const getUrl = () =>
            stepStates.find(x => x.step == stepNumber)?.url;
        if (id) {
            try {
                deleteFetch(`${getUrl()}${id}`);
            }
            catch {
                throw new ApiError("Error al consumir la api de delete");
            }
        }
        setList(prev => {
            const items = prev.filter(item => item.id !== id);
            if (items.length == 0) {
                setError('');
            }
            return items;
        });
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateItem = (index: number, field: keyof T, value: any) =>
        setList(prev => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));

    return { addItem, removeItem, updateItem };
}
