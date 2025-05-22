import { StepStateEnum } from "./lib";

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
    created_at: string;
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
    owner_id: string;
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
export enum PetStep {
    Name = 0,
    BasicData = 1,
    Vaccines = 2,
    Medicines = 3,
    LabTests = 4,
    Conditions = 5,
    Surgeries = 6
}

export const InitialStepsState = [
    { number: PetStep.Name, state: StepStateEnum.NotInitialize },
    { number: PetStep.BasicData, state: StepStateEnum.NotInitialize },
    { number: PetStep.Vaccines, state: StepStateEnum.NotInitialize },
    { number: PetStep.Medicines, state: StepStateEnum.NotInitialize },
    { number: PetStep.LabTests, state: StepStateEnum.NotInitialize },
    { number: PetStep.Conditions, state: StepStateEnum.NotInitialize },
    { number: PetStep.Surgeries, state: StepStateEnum.NotInitialize },
];

export interface FormRepository<T> {
  findByPet: (pet_id: string) => Promise<T[] | null>;
  delete?: (id: string) => Promise<void>
}