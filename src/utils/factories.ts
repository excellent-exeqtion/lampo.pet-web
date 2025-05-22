// src/utils/factories.ts
"use client";

import { v4 } from 'uuid';
import type {
  ConditionDataType,
  LabTestDataType,
  MedicineDataType,
  SurgeryDataType,
  VaccineDataType
} from '@/types/index';

export const emptyVaccine = (petId: string): Partial<VaccineDataType> => ({
    pet_id: petId,
    id: v4(),
    name: "",
    description: "",
    date: undefined,
    batch: "",
    brand: "",
});

export const emptyCondition = (petId: string): Partial<ConditionDataType> => ({
  id: v4(),
  pet_id: petId,
  condition: '',
  severity: '',
});

export const emptyLabTest = (petId: string): Partial<LabTestDataType> => ({
  id: v4(),
  pet_id: petId,
  name: '',
  type: '',
  date: undefined,
  result: '',
});

export const emptyMedicine = (petId: string): Partial<MedicineDataType> => ({
  id: v4(),
  pet_id: petId,
  name: '',
  dosage: '',
  frequency: '',
});

export const emptySurgery = (petId: string): Partial<SurgeryDataType> => ({
  id: v4(),
  pet_id: petId,
  name: '',
  date: undefined,
  description: '',
});