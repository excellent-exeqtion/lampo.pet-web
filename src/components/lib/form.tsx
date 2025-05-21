// src/components/forms/VaccineForm.tsx
"use client";
import React from "react";
import Steps from "./steps";
import Entities from "@/components/lib/entities";

interface FormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entityList: any[];
    step: number;
    entityName: string;
    loading: boolean;
    error: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: (entity: any, i: number) => React.JSX.Element
    onBack: () => void;
    handleAdd: () => void;
    handleRemove: (id: string | undefined) => void;
    handleSubmit: () => Promise<void>;
}

export default function Form({ entityList, step, entityName, loading, error, form, onBack, handleAdd, handleRemove, handleSubmit }: FormProps) {
    return (
        <Steps onBack={onBack} onNext={handleSubmit} loading={loading} step={step} error={error} >
            <Entities form={form} entityList={entityList} entityName={entityName} loading={loading} handleAdd={handleAdd} handleRemove={handleRemove} />
        </Steps >
    );
}
