// app/data/petdata.tsx
import { v4 } from "uuid";
import { Metadata } from "next";
import {
  FaHome,
  FaUser,
  FaSyringe,
  FaCut,
  FaPills,
  FaCloudSun,
  FaFlask,
  FaRocket,
  FaCog
} from "react-icons/fa";
import {
  BasicDataType,
  ConditionDataType,
  LabTestDataType,
  MedicineDataType,
  OwnerDataType,
  PetType,
  SurgeryDataType,
  VaccineDataType
} from "@/types/index";
import { MenuType } from "@/types/lib";

export const menuData = (show: boolean): MenuType[] => [
  { label: "Inicio", icon: <FaHome />, url: "/", show: true },
  { label: "Datos básicos", icon: <FaUser />, url: "/pages/basic-data", show },
  { label: "Vacunas", icon: <FaSyringe />, url: "/pages/vaccines", show },
  { label: "Cirugías", icon: <FaCut />, url: "/pages/surgeries", show },
  { label: "Medicinas", icon: <FaPills />, url: "/pages/medicines", show },
  { label: "Condiciones especiales", icon: <FaCloudSun />, url: "/pages/conditions", show },
  { label: "Lab. de exámenes", icon: <FaFlask />, url: "/pages/lab-tests", show },
  { label: "Mejora tu plan", icon: <FaRocket />, url: "/pages/upgrade", show: true },
  { label: "Configuraciones", icon: <FaCog />, url: "/pages/settings", show: true },
];

export const metadata: Metadata = {
  title: "Lampo",
  description: "Lampo es una herramienta para que ayudará a TU MASCOTA en sus proceso clínicos y veterinarios",
};

export const andresData: OwnerDataType = {
  owner_id: '8933eed8-daea-4e6c-b4db-44906b9f44f9',
  name: 'Andrés',
  last_name: 'Aulestia',
  phone: '+57 3146061490',
  address: 'Cra. 74 #152b-70 Torre 3 Apto. 1704',
  city: 'Bogotá',
  country: 'Colombia',
  email: 'a.aulestia@exe.com.co'
}

export const johnnyData: OwnerDataType = {
  owner_id: '41095adf-27a6-48f8-ada1-d8c7d3dd265a',
  name: 'Johnnatan',
  last_name: 'Ruiz',
  phone: '+57 3112849616',
  address: 'Calle 82 #19A-29 Apt 401',
  city: 'Bogotá',
  country: 'Colombia',
  email: 'excellent.exeqtion@gmail.com'
}

export const ownersData: OwnerDataType[] = [
  andresData,
  johnnyData
];

export const PetsData: PetType[] = [
  { id: 'A001', name: 'Camus', image: '/pets/camus.png', owner_id: andresData.owner_id },
  { id: 'A002', name: 'Polar', image: '/pets/polar.png', owner_id: johnnyData.owner_id },
  { id: 'A003', name: 'Toby', image: '/pets/toby.png', owner_id: johnnyData.owner_id }
];

export const camusData: BasicDataType =
{
  pet_id: 'A001', pet_type: 'Gato', gender: 'Macho', weight: '5.5 Kg', race: 'Mestizo', has_allergies: false,
  weight_condition: 'Normal', size: 'Mediano', lives_with_others: false,
  main_food: 'Taste the Wild', has_vaccine: true, last_vaccine_name: 'Parvigen', last_vaccine_date: new Date('2024-07-25'),
  is_castrated: true, castration_date: new Date('2023-12-02'), has_anti_flea: true, anti_flea_date: new Date('2023-12-15'),
  uses_medicine: false, special_condition: false
}

export const polarData: BasicDataType =
{
  pet_id: 'A002', pet_type: 'Perro', gender: 'Macho', weight: '7 Kg', race: 'Criollo', has_allergies: false,
  weight_condition: 'Normal', size: 'Mediano', lives_with_others: true,
  main_food: 'Pro Plan', has_vaccine: false,
  is_castrated: true, castration_date: new Date('2023-06-30'), has_anti_flea: false,
  uses_medicine: false, special_condition: false
};

export const tobyData: BasicDataType =
{
  pet_id: 'A003', pet_type: 'Perro', gender: 'Macho', weight: '9 Kg', race: 'Criollo', has_allergies: true,
  weight_condition: 'Normal', size: 'Mediano', lives_with_others: true,
  main_food: 'Vet Life', has_vaccine: false,
  is_castrated: true, castration_date: new Date('2019-05-03'), has_anti_flea: false,
  uses_medicine: false, special_condition: true
};

export const petsData: BasicDataType[] =
  [
    camusData,
    polarData,
    tobyData
  ];


export const vaccinesMock: VaccineDataType[] = [
  { id: v4(), pet_id: 'A001', name: "Rabia", description: "Vacuna contra la rabia", date: new Date('2025-03-15'), batch: "RAB12345", brand: "Nobivac" },
  { id: v4(), pet_id: 'A001', name: "Parvovirus", description: "Prevención de parvovirus", date: new Date('2025-02-10'), batch: "PARV67890", brand: "Canigen" },
  { id: v4(), pet_id: 'A002', name: "Parvovirus", description: "Prevención de parvovirus", date: new Date('2025-02-10'), batch: "PARV67890", brand: "Canigen" },
];

export const surgeriesMock: SurgeryDataType[] = [
  { id: v4(), pet_id: 'A001', name: "Castración", date: new Date("2024-11-20"), description: "Castración preventiva" },
  { id: v4(), pet_id: 'A001', name: "Extracción dental", date: new Date("2024-12-05"), description: "Tooth extraction" },
  { id: v4(), pet_id: 'A002', name: "Castración", date: new Date("2023-06-30"), description: "Castración preventiva" },
  { id: v4(), pet_id: 'A003', name: "Castración", date: new Date("2019-05-03"), description: "Castración preventiva" },
];

export const medicinesMock: MedicineDataType[] = [
  { id: v4(), pet_id: 'A001', name: "Antibiótico X", dosage: "250mg", frequency: "Cada 12 horas" },
  { id: v4(), pet_id: 'A001', name: "Vitamina C", dosage: "100mg", frequency: "Diaria" },
];

export const conditionsMock: ConditionDataType[] = [
  { id: v4(), pet_id: 'A001', condition: "Esterilidad aórtica", severity: "Moderada" },
  { id: v4(), pet_id: 'A001', condition: "Alergia alimentaria", severity: "Leve" },
  { id: v4(), pet_id: 'A003', condition: "Insuficiencia renal", severity: "Leve" },
];

export const labTestsMock: LabTestDataType[] = [
  { id: v4(), pet_id: 'A001', name: "Hemograma completo", type: "Blood", date: new Date("2025-01-10"), result: "Normal" },
  { id: v4(), pet_id: 'A001', name: "Ultrasonido abdominal", type: "Ultrasound", date: new Date("2024-12-22"), result: "Sin hallazgos" },
];