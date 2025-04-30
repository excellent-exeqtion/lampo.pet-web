"use client";
import React from "react";
import { surgeriesMock, SurgeryData } from "../../data/petdata";
import { useIsMobile } from "../../layout";
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
            <div key={name + date} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p><strong>Procedimiento:</strong> {name}</p>
              {date && <p><strong>Fecha:</strong> {date}</p>}
              {description && <p><strong>Notas:</strong> {description}</p>}
            </div>
          ))}
        </div>
      </main>
    );
}