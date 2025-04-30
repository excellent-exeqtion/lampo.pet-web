"use client";
import React from "react";
import { medicinesMock, MedicineData } from "../../data/petdata";
import { useIsMobile } from "../../layout";
import { FaPills } from "react-icons/fa";

export default function MedicinesModule() {
    const items = medicinesMock;
    const isMobile = useIsMobile();
  
    return (
      <main style={{ padding: isMobile ? "2rem 1rem" : "2rem" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaPills /> Medicinas
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem" }}>
          {items.map(({ name, dosage, frequency }) => (
            <div key={name} style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p><strong>Medicamento:</strong> {name}</p>
              <p><strong>Dosis:</strong> {dosage}</p>
              <p><strong>Frecuencia:</strong> {frequency}</p>
            </div>
          ))}
        </div>
      </main>
    );
}