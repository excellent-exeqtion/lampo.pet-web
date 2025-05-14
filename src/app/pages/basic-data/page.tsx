// app/basic-data/page.tsx (server component)
"use client";
import React from "react";
import { basicDataMock, contactMock } from "data/petdata";
import { useIsMobile } from "app/layout";
import { FaUser } from "react-icons/fa";

export interface BasicData {
  label: string;
  value: string;
}

export default function BasicDataModule() {

  // Datos básicos y de contacto
  const basicDataItems = basicDataMock;
  const contactItems = contactMock;

  const isMobile = useIsMobile();

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      {/* Datos básicos en tres columnas */}
      <section style={{ marginBottom: "2rem" }}>
        <h3><FaUser /> Datos básicos</h3>
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
        <h3><FaUser /> Datos de contacto</h3>
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
