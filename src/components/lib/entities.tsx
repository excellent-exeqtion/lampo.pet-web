// src/components/forms/VaccineForm.tsx
"use client";

import React from "react";
import { AddItem, Entity } from "@/components/index";

interface EntitiesProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: (item: any, id: number) => React.JSX.Element;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    entityList: any[];
    entityName: string;
    loadLoading: boolean;
    handleAdd: () => void;
}
export default function EntitiesComponent({ form, entityList, entityName, loadLoading, handleAdd }: EntitiesProps) {

    return (
        <div className="grid grid-cols-1 gap-6" style={{ display: 'flow' }}>
            {entityList.map((item, i: number) => (
                <Entity key={i.toString()} index={i} entityName={entityName} >
                    {form(item, i)}
                </Entity>
            ))}

            <AddItem entityName={entityName} loadLoading={loadLoading} handleAdd={handleAdd} count={entityList.length} />
        </div>
    );
}
