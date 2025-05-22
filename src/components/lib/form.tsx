// src/components/forms/VaccineForm.tsx
"use client";
import React from "react";
import Steps from "./steps";
import Entities from "@/components/lib/entities";

interface FormProps<T> {
    entityList: Partial<T>[];
    step: number;
    entityName: string;
    loading: boolean;
    error: string | null;
    form: (entity: T, i: number) => React.JSX.Element
    onBack: () => void;
    handleAdd: () => void;
    handleRemove: (id: string | undefined) => void;
    handleSubmit: () => Promise<void>;
}

export default function Form<T>({ entityList, step, entityName, loading, error, form, onBack, handleAdd, handleRemove, handleSubmit }: FormProps<T>) {
    return (
        <Steps onBack={onBack} onNext={handleSubmit} loading={loading} step={step} error={error} >
            <Entities form={form} entityList={entityList} entityName={entityName} loading={loading} handleAdd={handleAdd} handleRemove={handleRemove} />
        </Steps >
    );
}
