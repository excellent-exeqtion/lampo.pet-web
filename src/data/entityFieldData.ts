import { ConditionDataType, LabTestDataType, SurgeryDataType, VaccineDataType } from "@/types/index";
import { Dates } from "@/utils/index";

export function ForConditions(condition: ConditionDataType) {
    return [
        { label: "Condición", show: true, value: condition.condition },
        { label: "Severidad", show: true, value: condition.severity },
    ];
}

export function ForLabTests(labTest: LabTestDataType) {
    return [
        { label: "Prueba", show: true, value: labTest.name },
        { label: "Tipo", show: true, value: labTest.type },
        {
            label: "Fecha",
            show: labTest.date != null,
            value: Dates.format(labTest.date),
        },
        {
            label: "Resultado",
            show: labTest.result != null,
            value: labTest.result ?? "",
        },
    ];
}

export function ForMedicines(surgery: SurgeryDataType) {
    return [
        { label: "Procedimiento", show: true, value: surgery.name },
        {
            label: "Fecha",
            show: surgery.date != null,
            value: Dates.format(surgery.date),
        },
        {
            label: "Notas",
            show: surgery.description != null,
            value: surgery.description ?? "",
        },
    ];
}

export function ForSurgeries(surgery: SurgeryDataType) {
    return [
        { label: "Procedimiento", show: true, value: surgery.name },
        {
            label: "Fecha",
            show: surgery.date != null,
            value: Dates.format(surgery.date),
        },
        {
            label: "Notas",
            show: surgery.description != null,
            value: surgery.description ?? "",
        },
    ];
}

export function ForVaccines(vaccine: VaccineDataType) {
    return [
        { label: "Vacuna", show: true, value: vaccine.name },
        {
            label: "Descripción",
            show: vaccine.description != null,
            value: vaccine.description ?? "",
        },
        {
            label: "Fecha",
            show: vaccine.date != null,
            value: Dates.format(vaccine.date),
        },
        { label: "Lote", show: true, value: vaccine.batch },
        { label: "Marca", show: true, value: vaccine.brand },
    ];
}