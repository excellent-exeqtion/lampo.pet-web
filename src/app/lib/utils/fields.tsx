import React from "react";
import { Utils } from ".";

export function renderField(field: Utils.Field): React.JSX.Element {
    if (!field.show) {
        return <div></div>;
    }
    return (
        <div key={field.label} style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{field.label}:</p>
            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {field.value}</p>
        </div>
    );
}