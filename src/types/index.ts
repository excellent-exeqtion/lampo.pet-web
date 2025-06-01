export interface PetType {
    id: string;
    name: string;
    image?: string | null;
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
    has_allergies: boolean;
    weight_condition: string;
    size: string;
    lives_with_others: boolean;
    main_food: string;
    has_vaccine: boolean;
    last_vaccine_name?: string;
    last_vaccine_date?: Date;
    is_castrated: boolean;
    castration_date?: Date;
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
}
export interface VeterinaryAccessType {
    id: string;
    pet_id: string;
    pet_code_id: string;
    vet_first_name: string;
    vet_last_name: string;
    professional_registration: string;
    clinic_name: string;
    city: string;
}

export interface VeterinarianType {
    vet_id: string;
    first_name: string;
    last_name: string;
    email: string;
    registration: string;
    clinic_name: string;
    city: string;
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
}

export interface CreateSubscriptionType {
    ownerId: string;
    planVersionId: number;
    cycle: 'monthly' | 'annual';
    priceAtPurchase: number;
    discountApplied: number;
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

export interface ConsultationProcedureType {
    id: string; // uuid
    consultation_id: string; // uuid, FK to consultations
    procedure_name: string;
    description?: string | null;
    created_at: string; // timestamptz
}

export interface ConsultationMedicationType {
    id: string; // uuid
    consultation_id: string; // uuid, FK to consultations
    medication_name: string;
    dosage: string;
    frequency: string;
    duration_days?: number | null;
    notes?: string | null;
    created_at: string; // timestamptz
}

export interface ConsultationFileType {
    id: string; // uuid
    consultation_id: string; // uuid, FK to consultations
    file_name: string;
    file_path: string; // Path en Supabase Storage
    file_type?: string | null; // MIME type
    file_size_bytes?: number | null;
    uploaded_by_user_id?: string | null; // uuid, FK to auth.users (quien subió el archivo)
    created_at: string; // timestamptz
}

export interface ConsultationType {
    id: string; // uuid, PK
    pet_id: string; // uuid, FK to pets
    veterinarian_id?: string | null; // uuid, FK to auth.users (si es un vet con cuenta)
    veterinary_access_id?: string | null; // uuid, FK to veterinary_accesses (si se usó código)

    consultation_date: string; // date
    consultation_time?: string | null; // time
    hc_number?: string | null; // Número de historia clínica si aplica
    institution_name?: string | null; // Nombre de la clínica/institución

    // Anamnesis (basado en el formato)
    reason_for_consultation: string;
    current_diet?: string | null;
    previous_illnesses?: string | null;
    previous_surgeries?: string | null;
    vaccination_history?: string | null; // Podría ser un resumen, los detalles están en su propia sección
    last_deworming_product?: string | null;
    recent_treatments?: string | null;
    recent_travels?: string | null;
    animal_behavior_owner_description?: string | null;
    lives_with_other_animals_details?: string | null; // ej: "Sí, un perro y un gato"
    sterilized_status?: 'yes' | 'no' | 'unknown' | null; // o booleano si es más simple
    birth_count?: number | null;

    // Examen Físico General
    body_condition_score?: number | null; // Escala 1-5 o 1-9
    temperature_celsius?: number | null;
    heart_rate_bpm?: number | null; // FC
    respiratory_rate_rpm?: number | null; // FR
    capillary_refill_time_sec?: number | null; // TRPC / TLLC
    pulse_description?: string | null; // Descripción del pulso (fuerte, débil, rítmico)
    mucous_membranes_description?: string | null;
    hydration_percentage_description?: string | null; // Descripción o % estimado
    sense_organs_description?: string | null;

    // Examen Físico por Sistemas
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

    // Abordaje Diagnóstico
    problem_list?: string | null; // Podría ser un array de strings JSON.stringify
    master_problem_list?: string | null;
    differential_diagnoses?: string | null; // Podría ser un array de strings JSON.stringify

    // Exámenes Complementarios (Resumen textual, los archivos van en otra tabla)
    complementary_exams_summary?: string | null;

    // Diagnóstico y Plan
    presumptive_diagnosis: string;
    definitive_diagnosis?: string | null;
    therapeutic_plan: string;
    prognosis?: string | null;
    evolution_notes?: string | null; // Evolución durante la consulta o plan de seguimiento inmediato
    general_observations?: string | null; // Observaciones generales, recomendaciones de egreso, etc.
    signature_confirmation?: string | null; // Campo para que el vet confirme digitalmente (texto)


    // Relaciones (pobladas al hacer fetch si se usa SELECT anidado)
    procedures?: ConsultationProcedureType[];
    medications?: ConsultationMedicationType[];
    files?: ConsultationFileType[];

    created_at: string; // timestamptz
    updated_at: string; // timestamptz
}

// Payload para crear una consulta, puede ser un subconjunto o incluir arrays para sub-registros
export type CreateConsultationPayload = Omit<ConsultationType, 'id' | 'created_at' | 'updated_at' | 'procedures' | 'medications' | 'files'> & {
    procedures?: Array<Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>>;
    medications?: Array<Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>>;
    // Los archivos se manejarán con un endpoint separado después de crear la consulta,
    // o podrías tener un array de `File` objects aquí si tu API lo maneja en un solo paso.
};