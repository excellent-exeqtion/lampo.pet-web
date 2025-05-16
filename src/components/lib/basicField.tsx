import { FieldType } from "@/types/lib";

export interface BasicFieldProps {
    item: FieldType
}

export default function BasicField(props: BasicFieldProps) {
    if (!props.item.show) {
        return <div></div>;
    }
    return (
        <div key={props.item.label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{props.item.label}</p>
            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{props.item.value}</p>
        </div>
    );
}
