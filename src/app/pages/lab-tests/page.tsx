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
            <div key={name + date} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p><strong>Prueba:</strong> {name}</p>
              <p><strong>Tipo:</strong> {type}</p>
              {date && <p><strong>Fecha:</strong> {date}</p>}
              {result && <p><strong>Resultado:</strong> {result}</p>}
            </div>
          ))}
        </div>
      </main>
    );
}