// src/types/index.ts

export interface PetType {
    id: string;
    name: string;
    image?: string | null;
    birth_date?: Date | null; 
    owner_id: string;
}
export interface PetCodeType {
    id: string;
    pet_id: string;
    code: string;
    used: boolean;
    expires_at: string;
}
export interface OwnerDataType {
    owner_id: string;
    name: string;
    last_name: string;
    phone: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    city: string;
    country: string;
    email: string;
}
export interface BasicDataType {
    pet_id: string;
    pet_type: string;
    gender: string;
    weight: string;
    race: string;
    chip_number?: string | null;
    coat_type: string;
    color: string;
    has_allergies: boolean;
    weight_condition: string;
    size: string;
    lives_with_others: boolean;
    main_food: string;
    has_vaccine: boolean;
    last_vaccine_name?: string;
    last_vaccine_date?: Date;
    is_sterilized: boolean;
    sterilization_date?: Date;
    has_anti_flea: boolean;
    anti_flea_date?: Date;
    uses_medicine: boolean;
    special_condition: boolean;
}
export interface InitialBasicDataType {
    petType: string,
    food: string,
    race: string,
    otherPetType: string,
    otherFood: string,
    otherRace: string
}
export interface VaccineDataType {
    id: string;
    pet_id: string;
    name: string;
    description?: string;
    date?: Date;
    batch: string;
    brand: string;
    frequency?: string | null;
    next_dose_date?: Date | null;
}
export interface SurgeryDataType {
    id: string;
    pet_id: string;
    name: string;
    date?: Date;
    description?: string;
}
export interface MedicineDataType {
    id: string;
    pet_id: string;
    name: string;
    dosage: string;
    frequency: string;
}
export interface ConditionDataType {
    id: string;
    pet_id: string;
    condition: string;
    severity: string;
}
export interface LabTestDataType {
    id: string;
    pet_id: string;
    name: string;
    type: string;
    date?: Date;
    result?: string;
    next_test_date?: Date | null;
}
export interface PetTreatmentType {
    id: string;
    pet_id: string;
    type: 'antipulgas' | 'desparasitacion' | 'bano_medicado' | 'corte_unas';
    product_name?: string | null;
    date: Date;
    frequency?: string | null;
    next_dose_date?: Date | null;
    notes?: string | null;
}
export interface VeterinaryAccessType {
    id: string;
    pet_id: string;
    pet_code_id: string;
    vet_first_name: string;
    vet_first_last_name: string;
    vet_second_last_name: string;
    identification: string;
    professional_registration: string;
    clinic_name: string;
    city: string;
    is_validated?: boolean;
    validated_first_name?: string;
    validated_last_name?: string;
}

export interface VeterinarianType {
    vet_id: string;
    first_name: string;
    first_last_name: string;
    second_last_name: string;
    identification: string;
    email: string;
    registration: string;
    clinic_name: string;
    city: string;
    is_validated?: boolean;
    validated_first_name?: string;
    validated_last_name?: string;
}

export interface FeatureType {
    text: string;
    badge?: string;
}

export interface PlanType {
    id: number;
    slug: string;
}

export interface PlanVersionType {
    id: number;
    plan_id: number;
    slug: string;
    version: number;
    title: string;
    description: string;
    price_month: number;
    price_year: number;
    discount_month: number;
    discount_year: number;
    features: FeatureType[];
    effective_from: string;
    effective_to: string | null;
    plans: PlanType;
}
export interface SubscriptionType {
    id: number;
    user_id: string;
    plan_version_id: number;
    cycle: 'monthly' | 'annual';
    status: 'pending' | 'active' | 'canceled' | 'expired';
    external_id: string | null;
    price_at_purchase: number;
    discount_applied: number;
    started_at: string;
    expires_at: string | null;
    updated_at: string;
    plans_versions: PlanVersionType;
}

export interface CreateSubscriptionType {
    ownerId: string;
    planVersionId: number;
    cycle: 'monthly' | 'annual';
    priceAtPurchase: number;
    discountApplied: number;
}

export interface ProfessionalData {
    foto: string;
    nombres: string;
    apellidos: string;
    tituloObtenido: string;
    universidad: string;
    numeroMatricula: string;
    actaGrado: string;
    estado: 'Habilitado' | 'Desconocido';
    matriculaBuscada: string;
}

export enum PetStep {
    Name = 0,
    BasicData = 1,
    Vaccines = 2,
    Medicines = 3,
    LabTests = 4,
    Conditions = 5,
    Surgeries = 6
}

export interface CalendarEventType {
    event_id: string;
    title: string;
    event_date: string;
    event_type: 'birthday' | 'consultation' | 'vaccine' | 'treatment' | 'lab_test';
    pet_name: string;
    pet_id: string;
    description: string;
}

export interface ConsultationProcedureType {
    id: string;
    consultation_id: string;
    procedure_name: string;
    description?: string | null;
    created_at: string;
}

export interface ConsultationMedicationType {
    id: string;
    consultation_id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration_days?: number | null;
    notes?: string | null;
    created_at: string;
}

export interface ConsultationFileType {
    id: string;
    consultation_id: string;
    file_name: string;
    file_path: string;
    file_type?: string | null;
    file_size_bytes?: number | null;
    uploaded_by_user_id?: string | null;
    created_at: string;
}

export interface ConsultationType {
    id: string;
    pet_id: string;
    veterinarian_id?: string | null;
    veterinary_access_id?: string | null;
    consultation_date: string;
    consultation_time?: string | null;
    hc_number?: string | null;
    institution_name?: string | null;
    reason_for_consultation: string;
    current_diet?: string | null;
    previous_illnesses?: string | null;
    previous_surgeries?: string | null;
    vaccination_history?: string | null;
    last_deworming_product?: string | null;
    recent_treatments?: string | null;
    recent_travels?: string | null;
    animal_behavior_owner_description?: string | null;
    lives_with_other_animals_details?: string | null;
    sterilized_status?: 'yes' | 'no' | 'unknown' | null;
    birth_count?: number | null;
    body_condition_score?: number | null;
    temperature_celsius?: number | null;
    heart_rate_bpm?: number | null;
    respiratory_rate_rpm?: number | null;
    capillary_refill_time_sec?: number | null;
    pulse_description?: string | null;
    mucous_membranes_description?: string | null;
    hydration_percentage_description?: string | null;
    sense_organs_description?: string | null;
    skin_and_coat_description?: string | null;
    lymph_nodes_description?: string | null;
    digestive_system_findings?: string | null;
    respiratory_system_findings?: string | null;
    endocrine_system_findings?: string | null;
    musculoskeletal_system_findings?: string | null;
    nervous_system_findings?: string | null;
    urinary_system_findings?: string | null;
    reproductive_system_findings?: string | null;
    rectal_palpation_findings?: string | null;
    other_physical_findings?: string | null;
    problem_list?: string | null;
    master_problem_list?: string | null;
    differential_diagnoses?: string | null;
    complementary_exams_summary?: string | null;
    presumptive_diagnosis: string;
    definitive_diagnosis?: string | null;
    therapeutic_plan: string;
    prognosis?: string | null;
    evolution_notes?: string | null;
    general_observations?: string | null;
    signature_confirmation?: string | null;
    next_consultation_date?: Date | null;
    next_consultation_reason?: string | null;
    procedures?: ConsultationProcedureType[];
    medications?: ConsultationMedicationType[];
    files?: ConsultationFileType[];
    created_at: string;
    updated_at: string;
}

export type CreateConsultationPayload = Omit<ConsultationType, 'id' | 'created_at' | 'updated_at' | 'procedures' | 'medications' | 'files'> & {
    procedures?: Array<Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>>;
    medications?: Array<Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>>;
};