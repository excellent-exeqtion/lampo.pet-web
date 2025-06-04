// src/components/lib/basicField.tsx
import { FieldType } from "@/types/lib";

interface BasicFieldProps {
    item: FieldType
}

export default function BasicFieldComponent(props: BasicFieldProps) {
    if (!props.item.show) {
        return <div></div>;
    }
    return (
        <div key={props.item.label} style={{ backgroundColor: "var(--primary-inverse)", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px var(--primary-lighttransparent)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--primary-darkgray)", margin: 0 }}>{props.item.label}</p>
            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{props.item.value}</p>
        </div>
    );
}
