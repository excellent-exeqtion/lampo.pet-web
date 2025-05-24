// src/hooks/useEntityList.ts
"use client";

import { FormRepository } from '@/types/lib';
import { Dispatch, SetStateAction } from 'react';

export function useEntityList<T extends { id: string | undefined }>(
    repository: FormRepository<T>, 
    emptyFactory: (petId: string) => Partial<T>,
    petId: string,
    list: Partial<T>[],
    setList: Dispatch<SetStateAction<Partial<T>[]>>,
    setError: Dispatch<SetStateAction<string | null>>
) {
    const addItem = () => setList(prev => [...prev, emptyFactory(petId)]);
    const removeItem = (id?: string) => {
        if (id && repository) {
            repository.delete(id);
        }
        setList(prev => {
            const items = prev.filter(item => item.id !== id);
            if(items.length == 0){
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
