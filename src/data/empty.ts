import { PetType, PetCodeType, OwnerDataType, BasicDataType, VaccineDataType, SurgeryDataType, MedicineDataType, ConditionDataType, LabTestDataType, VeterinaryAccessType, FeatureType, PlanType, PlanVersionType, SubscriptionType } from "../types";

export function Pet(): PetType { return { id: '', name: '', image: '', owner_id: '' } };

export function PetCode(): PetCodeType { return { id: '', pet_id: '', code: '', used: false, expires_at: '' } };

export function OwnerData(): OwnerDataType {
    return {
        owner_id: '',
        name: '',
        last_name: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        email: ''
    }
};
export function BasicData(): BasicDataType {
    return {
        pet_id: '',
        pet_type: '',
        gender: '',
        weight: '',
        race: '',
        has_allergies: false,
        weight_condition: '',
        size: '',
        lives_with_others: false,
        main_food: '',
        has_vaccine: false,
        last_vaccine_name: undefined,
        last_vaccine_date: undefined,
        is_castrated: false,
        castration_date: undefined,
        has_anti_flea: false,
        anti_flea_date: undefined,
        uses_medicine: false,
        special_condition: false
    }
};
export function VaccineData(): VaccineDataType {
    return {
        id: '',
        pet_id: '',
        name: '',
        description: undefined,
        date: undefined,
        batch: '',
        brand: ''
    }
};
export function SurgeryData(): SurgeryDataType {
    return {
        id: '',
        pet_id: '',
        name: '',
        date: undefined,
        description: undefined
    }
};
export function MedicineData(): MedicineDataType {
    return {
        id: '',
        pet_id: '',
        name: '',
        dosage: '',
        frequency: ''
    }
};
export function ConditionData(): ConditionDataType {
    return {
        id: '',
        pet_id: '',
        condition: '',
        severity: ''
    }
};
export function LabTestData(): LabTestDataType {
    return {
        id: '',
        pet_id: '',
        name: '',
        type: '',
        date: undefined,
        result: undefined
    }
};
export function VeterinaryAccess(): VeterinaryAccessType {
    return {
        id: '',
        pet_id: '',
        pet_code_id: '',
        vet_first_name: '',
        vet_last_name: '',
        professional_registration: '',
        clinic_name: '',
        city: '',
        created_at: ''
    }
};
export function Feature(): FeatureType {
    return {
        text: '',
        badge: ''
    }
};
export function Plan(): PlanType {
    return {
        id: 0,
        slug: ''
    }
};
export function PlanVersion(): PlanVersionType {
    return {
        id: 0,
        plan_id: 0,
        slug: '',
        version: 0,
        title: '',
        description: '',
        price_month: 0,
        price_year: 0,
        discount_month: 0,
        discount_year: 0,
        features: [],
        effective_from: '',
        effective_to: null,
        plans: {
            id: 0,
            slug: ''
        }
    }
};
export function Subscription(): SubscriptionType {
    return {
        id: 0,
        owner_id: '',
        plan_version_id: 0,
        cycle: 'monthly',
        status: 'pending',
        external_id: null,
        price_at_purchase: 0,
        discount_applied: 0,
        started_at: '',
        expires_at: null,
        updated_at: ''
    }
};