// src/components/lib/entity.tsx
"use client";

import React from "react";
import { RemoveItem } from "@/components/index";

interface EntityProps {
    key: string;
    children: React.ReactNode;
    id: string | undefined; 
    entityName: string;
    index: number;
    loading: boolean;
    handleRemove: (id: string | undefined) => void;
}

export default function Entity({ children, id, index, entityName, loading, handleRemove }: EntityProps) {
    return (
        <fieldset
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded"
            style={{ display: 'flex' }} >
            <legend className="text-lg font-semibold">
                {entityName} #{index + 1}
            </legend>
            {children}
            <RemoveItem id={id} loading={loading} handleRemove={handleRemove} />
        </fieldset>
    );
}
