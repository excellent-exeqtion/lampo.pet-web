// app/vaccines/page.tsx (server component)
"use client";
import React from "react";
import { vaccinesMock } from "data/petdata";
import { useIsMobile } from "app/layout";
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
          <div key={batch} style={{ backgroundColor: "rgb(1, 114, 173)", padding: "0.1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Vacuna:</p><p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {name}</p>
            </div>
            {description &&
              <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Descripción:</p>
                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {description}</p>
              </div>}
            {date &&
              <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Fecha:</p>
                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {date}</p>
              </div>}
            <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Lote:</p>
              <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {batch}</p>
            </div>
            <div style={{ backgroundColor: "#fff", padding: "1rem", margin: '0.5rem', borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Marca:</p>
              <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}> {brand}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}