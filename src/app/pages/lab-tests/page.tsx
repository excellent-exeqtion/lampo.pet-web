"use client";
import React from "react";
import { labTestsMock, LabTestData } from "../../data/petdata";
import { useIsMobile } from "../../layout";
import { FaFlask } from "react-icons/fa";

export default function LabTestsModule() {
    const items = labTestsMock;
    const isMobile = useIsMobile();

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaFlask /> Lab. de exámenes
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
                {items.map(({ name, type, date, result }) => (
                    <div key={name + date} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Prueba:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{name}</p>
                        </div>
                        <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Tipo:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{type}</p>
                        </div>
                        {date && <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Fecha:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{date}</p>
                        </div>}
                        {result && <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Resultado:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{result}</p>
                        </div>}
                    </div>
                ))}
            </div>
        </main>
    );
}