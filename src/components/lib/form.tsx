// src/components/form.tsx
"use client";
import React from "react";
import StepsComponent from "./steps";
import EntitiesComponent from "@/components/lib/entities";

interface FormProps<T extends { id: string | undefined }> {
    entityList: Partial<T>[];
    step: number;
    totalSteps: number;
    entityName: string;
    submitLoading: boolean;
    loadLoading: boolean;
    error: string | null;
    form: (entity: T, i: number) => React.JSX.Element
    onBack: () => void;
    handleAdd: () => void;
    handleSubmit: () => Promise<void>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormComponent<T extends { id: string | undefined }>({ entityList, step, totalSteps, entityName, submitLoading, loadLoading, error, form, onBack, handleAdd, handleSubmit, setShowModal }: FormProps<T>) {
    return (
        <StepsComponent onBack={onBack} onNext={handleSubmit} submitLoading={submitLoading} loadLoading={loadLoading} step={step} totalSteps={totalSteps} error={error} setShowModal={setShowModal}>
            <EntitiesComponent form={form} entityList={entityList} entityName={entityName} loadLoading={loadLoading} handleAdd={handleAdd} />
        </StepsComponent >
    );
}
