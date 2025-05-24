// src/components/forms/VaccineForm.tsx
"use client";
import React from "react";
import Steps from "./steps";
import Entities from "@/components/lib/entities";

interface FormProps<T extends { id: string | undefined }> {
    entityList: Partial<T>[];
    step: number;
    totalSteps: number;
    entityName: string;
    submitLoading: boolean;
    loadLoading: boolean;
    error: string | null;
    form: (entity: T , i: number) => React.JSX.Element
    onBack: () => void;
    handleAdd: () => void;
    handleSubmit: () => Promise<void>;
}

export default function Form<T extends { id: string | undefined }>({ entityList, step, totalSteps, entityName, submitLoading, loadLoading, error, form, onBack, handleAdd, handleSubmit }: FormProps<T> ) {
    return (
        <Steps onBack={onBack} onNext={handleSubmit} submitLoading={submitLoading} loadLoading={loadLoading} step={step} totalSteps={totalSteps} error={error} >
            <Entities form={form} entityList={entityList} entityName={entityName} loadLoading={loadLoading} handleAdd={handleAdd} />
        </Steps >
    );
}
