export interface Pet {
    pet_id: string;
    name: string;
    image?: string | null;
    owner_id: string;
};

export interface OwnerData {
    owner_id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    email: string;
}

export interface BasicData {
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

export interface VaccineData {
    id: string;
    pet_id: string;
    name: string;
    description?: string;
    date?: Date;
    batch: string;
    brand: string;
}

export interface SurgeryData {
    id: string;
    pet_id: string;
    name: string;
    date?: Date;
    description?: string;
};

export interface ConditionData {
    id: string;
    pet_id: string;
    condition: string;
    severity: string;
}

export interface LabTestData {
    id: string;
    pet_id: string;
    name: string;
    type: string;
    date?: Date;
    result?: string;
}
