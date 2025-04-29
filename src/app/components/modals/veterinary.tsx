"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";

export default function VeterinaryModule({ setShowVetModal }: { setShowVetModal: Dispatch<SetStateAction<boolean>> }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
        <button onClick={() => setShowVetModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1rem", color: "#000", cursor: "pointer" }}>
          <FaTimes />
        </button>
        <article style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h4 style={{ marginBottom: "0.5rem" }}>Soy médico veterinario</h4>
          <p style={{ flexGrow: 1, marginBottom: "0.5rem" }}>Aquí puedes revisar el historial completo, modificarlo y agregar entradas a la historia de la mascota</p>
          <button style={{ width: "100%" }}>IR</button>
        </article>
      </div>
    </div>
  );
}
