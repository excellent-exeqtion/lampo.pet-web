// src/components/forms/VaccineForm.tsx
"use client";

import React, { Dispatch, useEffect, useState } from "react";
import { VaccineRepository } from "@/repos/vaccine.repository";
import { PetStep, type VaccineDataType } from "@/types/index";
import { Form } from "@/components/index";
import { v4 } from "uuid";
import { Step } from "@/utils/index";
import { StepsStateType, StepStateEnum } from "@/types/lib";
import { Empty } from "@/data/index";

interface VaccineFormProps {
    petId: string;
    vaccinesData: VaccineDataType[];
    setVaccinesData: (vaccinesData: VaccineDataType[]) => void;
    onNext: () => void;
    onBack: () => void;
    stepStates: StepsStateType[];
    setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

const emptyVaccine = (petId: string): Partial<VaccineDataType> => ({
    pet_id: petId,
    id: v4(),
    name: "",
    description: "",
    date: undefined,
    batch: "",
    brand: "",
});

export default function VaccineForm({ petId, vaccinesData, setVaccinesData, onNext, onBack, stepStates, setStepStates }: VaccineFormProps) {

    const step: number = PetStep.Vaccines;
    const setState = (stepState: StepStateEnum, stepError: string | null = null) => {
        Step.ChangeState(stepStates, setStepStates, step, stepState, stepError);
    }
    const stateEq = (stepState: StepStateEnum) => {
        return stepStates.find(x => x.number == step)?.state == stepState;
    }

    const [vaccines, setVaccines] = useState<Partial<VaccineDataType>[]>(vaccinesData);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [savedData, setSavedData] = useState<VaccineDataType[]>([Empty.VaccineData()]);
    const entityName = 'vacuna';

    useEffect(() => {
        if (JSON.stringify(savedData) != JSON.stringify(vaccines) && !stateEq(StepStateEnum.NotInitialize)) {
            setState(StepStateEnum.Modified);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vaccines]);

    useEffect(() => {
        const fetch = async () => {
            if (stateEq(StepStateEnum.NotInitialize)) {
                const vaccinesSaved = await VaccineRepository.findByPet(petId);
                if (vaccinesSaved) {
                    setSavedData(vaccinesSaved);
                    setVaccinesData(vaccinesSaved);
                    setVaccines(vaccinesSaved);
                }
                setState(StepStateEnum.Initialize);
            }
        };
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId]);

    useEffect(() => {
        setState(StepStateEnum.Modified);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vaccines]);

    // Añade una nueva fila
    const handleAdd = () => {
        setVaccines((prev) => [...prev, emptyVaccine(petId)]);
    };

    const handleRemove = (id: string | undefined) => {
        if (id) {
            VaccineRepository.delete(id);
        }
        setVaccines((prev) => prev.filter(v => v.id != id));
    }

    // Actualiza un campo de la vacuna en la posición i
    const handleChange = (
        i: number,
        field: keyof VaccineDataType,
        value: string | Date | undefined
    ) => {
        const updated = vaccines.map((v, idx) =>
            idx === i ? { ...v, [field]: value } : v
        );
        setVaccines(updated);
        setState(StepStateEnum.Modified);
    };

    // Envia todas las vacunas
    const handleSubmit = async () => {
        setError(null);
        // Validación: todas deben tener name, batch y brand
        for (let i = 0; i < vaccines.length; i++) {
            const v = vaccines[i];
            if (!v.name || !v.batch || !v.brand) {
                setError(`La vacuna #${i + 1} requiere nombre, lote y marca.`);
                return;
            }
        }

        setLoading(true);
        try {
            if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
                // Enviar en paralelo o en secuencia según repositorio
                const { error: vaccineErr } = await VaccineRepository.createAll(vaccines as VaccineDataType[]);
                if (vaccineErr) throw new Error(vaccineErr?.message || "Error creando vacunas");
                setSavedData(vaccines as VaccineDataType[]);
                setState(StepStateEnum.Saved);
            }
            onNext();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setState(StepStateEnum.Error, err.message);
            setError(err.message || "Error al guardar vacunas.");
        } finally {
            setLoading(false);
        }
    };

    const form = (vaccine: VaccineDataType, i: number) => {
        return (
            <React.Fragment>
                <label>
                    Nombre *
                    <input
                        type="text"
                        value={vaccine.name}
                        onChange={(e) =>
                            handleChange(i, "name", e.target.value)
                        }
                        required
                        className="w-full"
                    />
                </label>

                <label>
                    Descripción
                    <input
                        type="text"
                        value={vaccine.description || ""}
                        onChange={(e) =>
                            handleChange(i, "description", e.target.value)
                        }
                        className="w-full"
                    />
                </label>

                <label>
                    Fecha
                    <input
                        type="date"
                        value={
                            vaccine.date
                                ? (vaccine.date as Date)
                                    .toISOString()
                                    .substr(0, 10)
                                : ""
                        }
                        onChange={(e) =>
                            handleChange(
                                i,
                                "date",
                                e.target.valueAsDate || undefined
                            )
                        }
                        className="w-full"
                    />
                </label>

                <label>
                    Lote *
                    <input
                        type="text"
                        value={vaccine.batch}
                        onChange={(e) =>
                            handleChange(i, "batch", e.target.value)
                        }
                        required
                        className="w-full"
                    />
                </label>

                <label>
                    Marca *
                    <input
                        type="text"
                        value={vaccine.brand}
                        onChange={(e) =>
                            handleChange(i, "brand", e.target.value)
                        }
                        required
                        className="w-full"
                    />
                </label>
            </React.Fragment>);
    }

    return (
        <Form
            entityList={vaccines}
            step={step}
            entityName={entityName}
            loading={loading}
            error={error}
            form={form}
            onBack={onBack}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            handleSubmit={handleSubmit} />
    );
}
