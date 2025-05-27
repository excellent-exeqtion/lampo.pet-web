// src/components/lib/entityFields.tsx
"use client";

import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { FieldConfig } from "@/types/lib";
import { Dates } from "@/utils/index";
import React from "react";
import RemoveItemComponent from "./removeItem";


interface EntityFieldsProps<T extends { id: string | undefined }> {
    fieldsConfig: FieldConfig<T>[];
    item: T;
    index: number;
    loadLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateItem: (index: number, field: keyof T, value: any) => void;
    handleRemove: (id: string | undefined) => void;
}

export default function EntityFieldsComponent<T extends { id: string | undefined }>({
    fieldsConfig,
    item,
    index,
    loadLoading,
    updateItem,
    handleRemove
}: EntityFieldsProps<T>) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setValue = (type: 'text' | 'date', item: any, name: string | number | symbol): string | number | readonly string[] | undefined => {
        if (type == 'date') {
            return item[name] ? Dates.format(item[name]) : ''
        }
        return item[name] ?? "";
    }

    const { isMobile } = useDeviceDetect();

    const gridTemplateColumnsCalculateDesktopOrTablet = (count: number) => {
        switch (count) {
            case 5: return "repeat(3, 1fr)";
            case 4: return "repeat(3, 1fr)";
            case 3: return "repeat(4, 1fr)";
            case 2:
            default: return "repeat(3, 1fr)";
        }
    }

    // Estilo común de grid: en móvil siempre 2 columnas, en desktop auto-ajusta
    const sectionGridStyle: React.CSSProperties = {
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : gridTemplateColumnsCalculateDesktopOrTablet(fieldsConfig.length)
    };

    return (
        <div style={sectionGridStyle}>
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
            <RemoveItemComponent id={item.id} loadLoading={loadLoading} handleRemove={handleRemove} />
        </div>
    );
}
