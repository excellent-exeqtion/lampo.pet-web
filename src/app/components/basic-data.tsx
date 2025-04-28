"use client";
import React from "react";

export interface BasicData {
    label: string;
    value: string;
}

export default function BasicDataModule({ isMobile, basicDataItems, contactItems }: { isMobile: boolean, basicDataItems: BasicData[]; contactItems: BasicData[] }) {
  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      {/* Datos básicos en tres columnas */}
      <section style={{ marginBottom: "2rem" }}>
        <h3>Datos básicos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
          {basicDataItems.map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{label}</p>
              <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{value}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Datos de contacto en dos columnas */}
      <section>
        <h3>Datos de contacto</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {contactItems.map(({ label, value }) => (
            <div key={label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{label}</p>
              <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
