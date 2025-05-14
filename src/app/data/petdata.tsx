// app/data/petdata.tsx
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

// Datos básicos y de contacto
export const basicDataMock = [
  { label: "Tipo de mascota", value: "Gato" },
  { label: "Género", value: "Macho" },
  { label: "Peso", value: "5.5 KG" },
  { label: "Raza", value: "Mestizo" },
  { label: "Alergias", value: "No" },
  { label: "Condición de peso", value: "Normal" },
  { label: "Tamaño", value: "Mediano" },
  { label: "Vive con otros", value: "No" },
  { label: "Comida principal", value: "Taste the Wild" },
];

export const contactMock = [
  { label: "Nombre del contacto", value: "Andrés Aulestia" },
  { label: "Teléfono", value: "+57 3146061490" },
  { label: "Dirección", value: "Cra. 74 #152b-70 Torre 3 Apto. 1704" },
  { label: "Ciudad", value: "Bogotá" },
  { label: "País", value: "Colombia" },
  { label: "Email", value: "a.aulestia@exe.com.co" },
  { label: "Última vacuna", value: "Parvigen (2024-07-25)" },
  { label: "Castrado", value: "Sí (2023-12-02)" },
  { label: "Antipulgas", value: "Sí (2023-12-15)" },
  { label: "¿Usa medicina?", value: "No" },
  { label: "Condición especial", value: "No" },
];

export const menuData = [
  { label: "Inicio", icon: <FaHome />, url: "/" },
  { label: "Datos básicos", icon: <FaUser />, url: "/pages/basic-data" },
  { label: "Vacunas", icon: <FaSyringe />, url: "/pages/vaccines" },
  { label: "Cirugías", icon: <FaCut />, url: "/pages/surgeries" },
  { label: "Medicinas", icon: <FaPills />, url: "/pages/medicines" },
  { label: "Condiciones atm.", icon: <FaCloudSun />, url: "/pages/conditions" },
  { label: "Lab. de exámenes", icon: <FaFlask />, url: "/pages/lab-tests" },
  { label: "Mejora tu plan", icon: <FaRocket />, url: "/pages/upgrade" },
  { label: "Configuraciones", icon: <FaCog />, url: "/pages/settings" },
];


export const metadata: Metadata = {
  title: "Lampo",
  description: "Lampo es una herramienta para que ayudará a TU MASCOT en sus proceso clínicos y veterinarios",
};


// Interfaces y mocks para las páginas específicas
export interface VaccineData {
  name: string;
  description?: string;
  date?: string;
  batch: string;
  brand: string;
}
export const vaccinesMock: VaccineData[] = [
  { name: "Rabia", description: "Vacuna contra la rabia", date: "2025-03-15", batch: "RAB12345", brand: "Nobivac" },
  { name: "Parvovirus", description: "Prevención de parvovirus", date: "2025-02-10", batch: "PARV67890", brand: "Canigen" },
];

export interface SurgeryData {
  name: string;
  date?: string;
  description?: string;
}
export const surgeriesMock: SurgeryData[] = [
  { name: "Castración", date: "2024-11-20", description: "Castración preventiva" },
  { name: "Extracción dental", date: "2024-12-05", description: "Tooth extraction" },
];

export interface MedicineData {
  name: string;
  dosage: string;
  frequency: string;
}
export const medicinesMock: MedicineData[] = [
  { name: "Antibiótico X", dosage: "250mg", frequency: "Cada 12 horas" },
  { name: "Vitamina C", dosage: "100mg", frequency: "Diaria" },
];

export interface ConditionData {
  condition: string;
  severity: string;
}
export const conditionsMock: ConditionData[] = [
  { condition: "Esterilidad aórtica", severity: "Moderada" },
  { condition: "Alergia alimentaria", severity: "Leve" },
];

export interface LabTestData {
  name: string;
  type: string;
  date?: string;
  result?: string;
}
export const labTestsMock: LabTestData[] = [
  { name: "Hemograma completo", type: "Blood", date: "2025-01-10", result: "Normal" },
  { name: "Ultrasonido abdominal", type: "Ultrasound", date: "2024-12-22", result: "Sin hallazgos" },
];