import { FieldType } from "@/types/lib";
import React from "react";

interface FieldsProps {
    field: FieldType;
} 

export default function Field(props: FieldsProps) {
    if (!props.field.show) {
        return <div></div>;
    }
    return (
        <div key={props.field.label} style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{props.field.label}:</p>
            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {props.field.value}</p>
        </div>
    );
}