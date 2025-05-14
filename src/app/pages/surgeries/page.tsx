// app/surgeries/page.tsx (server component)
"use client";
import React from "react";
import { surgeriesMock } from "data/petdata";
import { useIsMobile } from "app/layout";
import { FaCut } from "react-icons/fa";

export default function SurgeriesModule() {
    const items = surgeriesMock;
    const isMobile = useIsMobile();

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaCut /> Cirugías
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
                {items.map(({ name, date, description }) => (
                    <div key={name + date} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Procedimiento:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {name}</p>
                        </div>
                        {date &&
                            <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Fecha:</p>
                                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {date}</p>
                            </div>}
                        {description &&
                            <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Notas:</p>
                                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {description}</p>
                            </div>}
                    </div>
                ))}
            </div>
        </main>
    );
}