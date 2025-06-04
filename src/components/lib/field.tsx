// src/components/lib/field.tsx
import { FieldType } from "@/types/lib";
import React from "react";

interface FieldsProps {
    field: FieldType;
} 

export default function FieldComponent(props: FieldsProps) {
    if (!props.field.show) {
        return <div></div>;
    }
    return (
        <div key={props.field.label} style={{ backgroundColor: "var(--primary-inverse)", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px var(--primary-lighttransparent)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--primary-lightgray)", margin: 0 }}>{props.field.label}:</p>
            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {props.field.value}</p>
        </div>
    );
}