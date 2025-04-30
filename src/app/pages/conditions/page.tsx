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
            <div key={condition} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p><strong>Condición:</strong> {condition}</p>
              <p><strong>Severidad:</strong> {severity}</p>
            </div>
          ))}
        </div>
      </main>
    );
}