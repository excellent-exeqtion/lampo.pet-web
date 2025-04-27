"use client";
import React from "react";
import { FaTimes, FaShareAlt } from "react-icons/fa";

export default function PetCodeModule({ setShowCodeModal }: { setShowCodeModal: any }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
        <button onClick={() => setShowCodeModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1rem", color: "#000", cursor: "pointer" }}>
          <FaTimes />
        </button>
        <div>
          <p><strong>Código único de tu mascota</strong></p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            {"A001".split("").map((char, idx) => (
              <span key={idx} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem", color: "#007BFF", fontWeight: "bold" }}>
                {char}
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.8rem" }}>Este código es único para cada mascota. Compártelo con tu médico veterinario para brindarle acceso al historial.</p>
          <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <FaShareAlt size={20} /> Comparte Lampo con tu médico veterinario
          </button>
        </div>
      </div>
    </div>
  );
}
