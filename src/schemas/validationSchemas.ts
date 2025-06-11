// src/schemas/validationSchemas.ts
import { z } from 'zod';

// PetType
export const PetTypeSchema = z.object({
  id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  name: z.string(),
  image: z.string().nullable().optional(),
  owner_id: z.string(),
});

// PetCodeType
export const PetCodeTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
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
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  city: z.string(),
  country: z.string(),
  email: z.string(),
});

// BasicDataType
export const BasicDataTypeSchema = z.object({
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
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
  last_vaccine_name: z.string().optional().nullable(),
  last_vaccine_date: z.string().optional().nullable(),
  is_castrated: z.boolean(),
  castration_date: z.string().optional().nullable(),
  has_anti_flea: z.boolean(),
  anti_flea_date: z.string().optional().nullable(),
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
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  name: z.string(),
  description: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  batch: z.string(),
  brand: z.string(),
});

// SurgeryDataType
export const SurgeryDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  name: z.string(),
  date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// MedicineDataType
export const MedicineDataTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
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
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  name: z.string(),
  type: z.string(),
  date: z.string().optional().nullable(),
  result: z.string().optional().nullable(),
});

// VeterinaryAccessType
export const VeterinaryAccessTypeSchema = z.object({
  id: z.string(),
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  pet_code_id: z.string(),
  vet_first_name: z.string(),
  vet_first_last_name: z.string(),
  vet_second_last_name: z.string(),
  identification: z.string(),
  professional_registration: z.string(),
  clinic_name: z.string(),
  city: z.string(),
  created_at: z.string(),
});

//Veterinarian
export const VeterinarianTypeSchema = z.object({
  vet_id: z.string().uuid(),
  first_name: z.string(),
  first_last_name: z.string(),
  second_last_name: z.string(),
  identification: z.string(),
  email: z.string().email(),
  registration: z.string(),
  clinic_name: z.string(),
  city: z.string(),
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

export const SubscriptionInsertSchema = z.object({
  ownerId: z.string(),
  planVersionId: z.string(),
  cycle: z.enum(["monthly", "annual"]),
  priceAtPurchase: z.number(),
  discountApplied: z.number()
});


export const ConsultationProcedurePayloadSchema = z.object({
  procedure_name: z.string().min(1, "El nombre del procedimiento es requerido."),
  description: z.string().optional().nullable(),
  // No incluyas consultation_id aquí, se añade en el backend
});

export const ConsultationMedicationPayloadSchema = z.object({
  medication_name: z.string().min(1, "El nombre del medicamento es requerido."),
  dosage: z.string().min(1, "La dosis es requerida."),
  frequency: z.string().min(1, "La frecuencia es requerida."),
  duration_days: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const CreateConsultationPayloadSchema = z.object({
  pet_id: z.string().regex(new RegExp(/^[A-Za-z]\d{3}$/)),
  consultation_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Fecha de consulta inválida.",
  }), // o z.date() si envías objetos Date
  reason_for_consultation: z.string().min(1, "El motivo de la consulta es requerido."),
  current_diet: z.string().optional().nullable(),
  previous_illnesses: z.string().optional().nullable(),
  previous_surgeries: z.string().optional().nullable(),
  vaccination_history: z.string().optional().nullable(), // Podría ser más estructurado
  last_deworming_product: z.string().optional().nullable(),
  recent_treatments: z.string().optional().nullable(),
  recent_travels: z.string().optional().nullable(),
  animal_behavior_owner_description: z.string().optional().nullable(),

  // Examen Físico General
  body_condition_score: z.number().min(1).max(5).optional().nullable(), // Asumiendo escala 1-5
  temperature_celsius: z.number().optional().nullable(),
  heart_rate_bpm: z.number().int().positive().optional().nullable(),
  respiratory_rate_rpm: z.number().int().positive().optional().nullable(),
  capillary_refill_time_sec: z.number().positive().optional().nullable(),
  mucous_membranes_description: z.string().optional().nullable(),
  hydration_percentage: z.number().min(0).max(100).optional().nullable(), // O descripción
  sense_organs_description: z.string().optional().nullable(),
  skin_and_coat_description: z.string().optional().nullable(),
  lymph_nodes_description: z.string().optional().nullable(),
  digestive_system_findings: z.string().optional().nullable(),
  respiratory_system_findings: z.string().optional().nullable(),
  endocrine_system_findings: z.string().optional().nullable(),
  musculoskeletal_system_findings: z.string().optional().nullable(),
  nervous_system_findings: z.string().optional().nullable(),
  urinary_system_findings: z.string().optional().nullable(),
  reproductive_system_findings: z.string().optional().nullable(),
  rectal_palpation_findings: z.string().optional().nullable(),
  other_physical_findings: z.string().optional().nullable(),

  // Abordaje Diagnóstico
  problem_list: z.string().optional().nullable(), // Podría ser un array de strings
  master_problem_list: z.string().optional().nullable(),
  differential_diagnoses: z.string().optional().nullable(), // Podría ser un array

  // Exámenes Complementarios (se manejan con subida de archivos, o podrían ser campos de texto)
  // Aquí solo información textual si no se suben archivos para todo
  complementary_exams_summary: z.string().optional().nullable(),

  presumptive_diagnosis: z.string().min(1, "El diagnóstico presuntivo es requerido."),
  definitive_diagnosis: z.string().optional().nullable(),
  therapeutic_plan: z.string().min(1, "El plan terapéutico es requerido."),
  prognosis: z.string().optional().nullable(),
  evolution_notes: z.string().optional().nullable(), // Para la evolución inicial si aplica
  general_observations: z.string().optional().nullable(),

  // Campos para identificar al veterinario, opcionales si se infieren de la sesión
  veterinarian_id: z.string().uuid("ID de veterinario inválido.").optional().nullable(),
  veterinary_access_id: z.string().uuid("ID de acceso veterinario inválido.").optional().nullable(),

  // Arrays para procedimientos y medicamentos que se crearán junto con la consulta
  procedures: z.array(ConsultationProcedurePayloadSchema).optional(),
  medications: z.array(ConsultationMedicationPayloadSchema).optional(),
});