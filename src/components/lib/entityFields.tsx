// src/components/lib/entityFields.tsx
"use client";

import { FieldConfig } from "@/types/lib";
import { Dates } from "@/utils/index";
import React from "react";


interface EntityFieldsProps<T> {
    fieldsConfig: FieldConfig<T>[];
    item: T;
    index: number;
    loadLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateItem: (index: number, field: keyof T, value: any) => void;
}

export default function EntityFields<T extends object>({
    fieldsConfig,
    item,
    index,
    loadLoading,
    updateItem,
}: EntityFieldsProps<T>) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setValue = (type: 'text' | 'date', item: any, name: string | number | symbol): string | number | readonly string[] | undefined => {
        if (type == 'date') {
            return item[name] ? Dates.format(item[name]) : ''
        }
        return item[name] ?? "";
    }

    return (
        <>
            {fieldsConfig.map(({ label, name, type, mandatory, className }) => (
                <label key={`${String(name)}-${index}`} className={className}>
                    {label}
                    <input
                        type={type}
                        value={setValue(type, item, name)}
                        disabled={loadLoading}
                        onChange={(e) =>
                            updateItem(
                                index,
                                name,
                                type === "date"
                                    ? (e.target as HTMLInputElement).valueAsDate
                                    : (e.target as HTMLInputElement).value
                            )
                        }
                        required={mandatory}
                        className="w-full"
                    />
                </label>
            ))}
        </>
    );
}
