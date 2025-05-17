export interface PetType {
    id: string;
    name: string;
    image?: string | null;
    owner_id: string;
};

export interface PetCodeType {
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
};

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
