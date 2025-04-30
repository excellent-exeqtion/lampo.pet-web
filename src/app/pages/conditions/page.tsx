"use client";
import React from "react";
import { conditionsMock, ConditionData } from "../../data/petdata";
import { useIsMobile } from "../../layout";
import { FaCloudSun } from "react-icons/fa";

export default function ConditionsModule() {
    const items = conditionsMock;
    const isMobile = useIsMobile();

    return (
        <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FaCloudSun /> Condiciones atm.
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
                {items.map(({ condition, severity }) => (
                    <div key={condition} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Condición:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{condition}</p>
                        </div>
                        <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Severidad:</p>
                            <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{severity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}