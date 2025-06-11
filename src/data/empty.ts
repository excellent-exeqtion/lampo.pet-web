import { StepsStateType, StepStateEnum } from "@/types/lib";
import { PetType, PetCodeType, OwnerDataType, BasicDataType, VaccineDataType, SurgeryDataType, MedicineDataType, ConditionDataType, LabTestDataType, VeterinaryAccessType, FeatureType, PlanType, PlanVersionType, SubscriptionType, PetStep, VeterinarianType } from "@/types/index";
import { ConditionRepository, LabTestRepository, MedicineRepository, SurgeryRepository, VaccineRepository } from "../repositories";
import { BasicDataTypeSchema, ConditionDataTypeSchema, LabTestDataTypeSchema, MedicineDataTypeSchema, PetTypeSchema, SurgeryDataTypeSchema, VaccineDataTypeSchema } from "@/schemas/validationSchemas";

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
        weight: '0 Kg',
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
        plans: Plan()
    }
};
export function Subscription(): SubscriptionType {
    return {
        id: 0,
        user_id: '',
        plan_version_id: 0,
        cycle: 'monthly',
        status: 'pending',
        external_id: null,
        price_at_purchase: 0,
        discount_applied: 0,
        started_at: '',
        expires_at: null,
        updated_at: '',
        plans_versions: PlanVersion()
    }
};

export function VetAccess(): VeterinaryAccessType {
    return {
        id: '',
        pet_id: '',
        pet_code_id: '',
        vet_first_name: '',
        vet_first_last_name: '',
        vet_second_last_name: '',
        identification: '',
        professional_registration: '',
        clinic_name: '',
        city: ''
    }
}

export function VetData(): VeterinarianType {
    return {
        vet_id: '',
        first_name: '',
        first_last_name: '',
        second_last_name: '',
        identification: '',
        email: '',
        registration: '',
        clinic_name: '',
        city: ''
    }
}

export function Steps(): StepsStateType[] {
    return [
        { step: PetStep.Name, state: StepStateEnum.NotInitialize, schema: PetTypeSchema },
        { step: PetStep.BasicData, state: StepStateEnum.NotInitialize, schema: BasicDataTypeSchema },
        { step: PetStep.Vaccines, state: StepStateEnum.NotInitialize, schema: VaccineDataTypeSchema, url: '/api/pets/list/vaccines/', repository: new VaccineRepository() },
        { step: PetStep.Medicines, state: StepStateEnum.NotInitialize, schema: MedicineDataTypeSchema, url: '/api/pets/list/medicines/', repository: new MedicineRepository() },
        { step: PetStep.LabTests, state: StepStateEnum.NotInitialize, schema: LabTestDataTypeSchema, url: '/api/pets/list/lab-tests/', repository: new LabTestRepository() },
        { step: PetStep.Conditions, state: StepStateEnum.NotInitialize, schema: ConditionDataTypeSchema, url: '/api/pets/list/conditions/', repository: new ConditionRepository() },
        { step: PetStep.Surgeries, state: StepStateEnum.NotInitialize, schema: SurgeryDataTypeSchema, url: '/api/pets/list/surgeries/', repository: new SurgeryRepository() }
    ];
}

import { Empty } from "../data";

export function emptyStorage() {
    return {
        resetSession: () => { },
        resetPet: () => { },
        storedPet: Empty.Pet(),
        setStoredPet: () => { },
        storedBasicData: Empty.BasicData(),
        setStoredBasicData: () => { },
        storedOwnerData: Empty.OwnerData(),
        setStoredOwnerData: () => { },
        storedVetData: Empty.VetData(),
        setStoredVetData: () => { },
        storedVetAccess: Empty.VetAccess(),
        setStoredVetAccess: () => { },
        storedPetCode: Empty.PetCode(),
        setStoredPetCode: () => { },
        storedOwnerPets: [],
        setStoredOwnerPets: () => { },
        storedVaccineData: [],
        setStoredVaccineData: () => { },
        storedConditionData: [],
        setStoredConditionData: () => { },
        storedLabTestData: [],
        setStoredLabTestData: () => { },
        storedMedicineData: [],
        setStoredMedicineData: () => { },
        storedSurgeryData: [],
        setStoredSurgeryData: () => { }
    }
}