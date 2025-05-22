// src/hooks/useEntityList.ts
"use client";

import { Dispatch, SetStateAction } from 'react';

export function useEntityList<T extends { id?: string }>(
  emptyFactory: (petId: string) => Partial<T>,
  petId: string,
  list: Partial<T>[],
  setList: Dispatch<SetStateAction<Partial<T>[]>>
) {
  const addItem = () => setList(prev => [...prev, emptyFactory(petId)]);
  const removeItem = (id?: string) => setList(prev => prev.filter(item => item.id !== id));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateItem = (index: number, field: keyof T, value: any) =>
    setList(prev => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));

  return { addItem, removeItem, updateItem };
}
