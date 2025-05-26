// src/schemas/validationSchemas.ts
import { z } from 'zod';

// PetType
export const PetTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable().optional(),
  owner_id: z.string(),
});

// PetCodeType
export const PetCodeTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  code: z.string(),
  used: z.boolean(),
  expires_at: z.string(),
});

// OwnerDataType
export const OwnerDataTypeSchema = z.object({
  owner_id: z.string(),
  name: z.string(),
  last_name: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  email: z.string(),
});

// BasicDataType
export const BasicDataTypeSchema = z.object({
  pet_id: z.string(),
  pet_type: z.string(),
  gender: z.string(),
  weight: z.string(),
  race: z.string(),
  has_allergies: z.boolean(),
  weight_condition: z.string(),
  size: z.string(),
  lives_with_others: z.boolean(),
  main_food: z.string(),
  has_vaccine: z.boolean(),
  last_vaccine_name: z.string().optional(),
  last_vaccine_date: z.string().optional(),
  is_castrated: z.boolean(),
  castration_date: z.string().optional(),
  has_anti_flea: z.boolean(),
  anti_flea_date: z.string().optional(),
  uses_medicine: z.boolean(),
  special_condition: z.boolean(),
});

// InitialBasicDataType
export const InitialBasicDataTypeSchema = z.object({
  petType: z.string(),
  food: z.string(),
  race: z.string(),
  otherPetType: z.string(),
  otherFood: z.string(),
  otherRace: z.string(),
});

// VaccineDataType
export const VaccineDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  date: z.string().optional(),
  batch: z.string(),
  brand: z.string(),
});

// SurgeryDataType
export const SurgeryDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  name: z.string(),
  date: z.string().optional(),
  description: z.string().optional(),
});

// MedicineDataType
export const MedicineDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
});

// ConditionDataType
export const ConditionDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  condition: z.string(),
  severity: z.string(),
});

// LabTestDataType
export const LabTestDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  name: z.string(),
  type: z.string(),
  date: z.string().optional(),
  result: z.string().optional(),
});

// VeterinaryAccessType
export const VeterinaryAccessTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string(),
  pet_code_id: z.string(),
  vet_first_name: z.string(),
  vet_last_name: z.string(),
  professional_registration: z.string(),
  clinic_name: z.string(),
  city: z.string(),
  created_at: z.string(),
});

// FeatureType
export const FeatureTypeSchema = z.object({
  text: z.string(),
  badge: z.string().optional(),
});

// PlanType
export const PlanTypeSchema = z.object({
  id: z.number(),
  slug: z.string(),
});

// PlanVersionType
export const PlanVersionTypeSchema = z.object({
  id: z.number(),
  plan_id: z.number(),
  slug: z.string(),
  version: z.number(),
  title: z.string(),
  description: z.string(),
  price_month: z.number(),
  price_year: z.number(),
  discount_month: z.number(),
  discount_year: z.number(),
  features: z.array(FeatureTypeSchema),
  effective_from: z.string(),
  effective_to: z.string().nullable(),
  plans: PlanTypeSchema,
});

// SubscriptionType
export const SubscriptionTypeSchema = z.object({
  id: z.number(),
  owner_id: z.string(),
  plan_version_id: z.number(),
  cycle: z.enum(['monthly', 'annual']),
  status: z.enum(['pending', 'active', 'canceled', 'expired']),
  external_id: z.string().nullable(),
  price_at_purchase: z.number(),
  discount_applied: z.number(),
  started_at: z.string(),
  expires_at: z.string().nullable(),
  updated_at: z.string(),
});
