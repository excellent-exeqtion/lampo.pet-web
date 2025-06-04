// src/components/lib/entity.tsx
"use client";

import { Strings } from "@/utils/index";
import React from "react";

interface EntityProps {
    key: string;
    children: React.ReactNode;
    entityName: string;
    index: number;
}

export default function EntityComponent({ children, index, entityName }: EntityProps) {
    

    return (
        <fieldset
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded"
            style={{ display: 'flex', border: '1px solid var(--pico-primary)', borderRadius: '10px', padding: '1rem' }} >
            <legend className="text-lg font-semibold" >
                <b style={{paddingLeft: '1rem', paddingRight: '1rem'}}>{Strings.titleCase(entityName)} #{index + 1}</b>
            </legend>
            {children}
        </fieldset>
    );
}
