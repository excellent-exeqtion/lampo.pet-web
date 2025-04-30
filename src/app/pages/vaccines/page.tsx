"use client";
import React from "react";
import { vaccinesMock, VaccineData } from "../../data/petdata";
import { useIsMobile } from "../../layout";
import { FaSyringe } from "react-icons/fa";

export default function VaccinesModule() {
    const items = vaccinesMock || [];
    const isMobile = useIsMobile();
  
    return (
      <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaSyringe /> Vacunas
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
          {items.map(({ name, description, date, batch, brand }) => (
            <div key={batch} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p><strong>Vacuna:</strong> {name}</p>
              {description && <p><strong>Descripción:</strong> {description}</p>}
              {date && <p><strong>Fecha:</strong> {date}</p>}
              <p><strong>Lote:</strong> {batch}</p>
              <p><strong>Marca:</strong> {brand}</p>
            </div>
          ))}
        </div>
      </main>
    );
}