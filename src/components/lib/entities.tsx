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
    loading: boolean;
    handleAdd: () => void;
    handleRemove: (id: string | undefined) => void;
}
export default function Entities({ form, entityList, entityName, loading, handleAdd, handleRemove }: EntitiesProps) {

    return (
        <div className="grid grid-cols-1 gap-6" style={{ display: 'flow' }}>
            {entityList.map((item, i: number) => (
                <Entity key={i.toString()} id={item.id} index={i} entityName={entityName} loading={loading} handleRemove={handleRemove} >
                    {form(item, i)}
                </Entity>
            ))}

            <AddItem entityName={entityName} loading={loading} handleAdd={handleAdd} count={entityList.length} />
        </div>
    );
}
