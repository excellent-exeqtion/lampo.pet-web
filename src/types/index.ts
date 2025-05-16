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
    phone: string;
    address: string;
    city: string;
    country: string;
    email: string;
}

export interface BasicDataType {
    pet_id: string;
    petType: string;
    gender: string;
    weight: string;
    race: string;
    hasAllergies: boolean;
    weightCondition: string;
    size: string;
    livesWithOthers: boolean;
    mainFood: string;
    hasVaccine: boolean;
    lastVaccineName?: string;
    lastVaccineDate?: Date;
    isCastrated: boolean;
    castrationDate?: Date;
    hasAntiFlea: boolean;
    antiFleaDate?: Date;
    usesMedicine: boolean;
    specialCondition: boolean;
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
