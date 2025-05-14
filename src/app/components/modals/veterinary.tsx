// app/components/modals/vet-code.tsx
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function VeterinaryModule({ setShowVetModal }: { setShowVetModal: Dispatch<SetStateAction<boolean>> }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    if (!code.trim()) {
      setError("Por favor ingresa un código.");
      return;
    }
    setLoading(true);

    try {
      setCode(code.replaceAll(" ",""));
      const res = await fetch("/api/vet/use-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Código inválido o expirado.");
      } else {
        // Cerrar el modal y redirigir
        setShowVetModal(false);
        router.push(`/pages/vet/${code}`);
      }
    } catch (e) {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 2000
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          position: "relative"
        }}
      >
        <button
          onClick={() => setShowVetModal(false)}
          style={{
            position: "absolute", top: "0.5rem", right: "0.5rem",
            background: "none", border: "none", fontSize: "1rem",
            color: "#000", cursor: "pointer"
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: "0.5rem" }}>Soy médico veterinario</h2>

        <p style={{ flexGrow: 1, marginBottom: "0.5rem" }}>Aquí puedes revisar el historial completo, modificarlo y agregar entradas a la historia de la mascota</p>

        <h4 style={{ marginBottom: "1rem" }}>Introduce el código de la mascota</h4>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. U8Y499"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "0.25rem",
            textTransform: "uppercase"
          }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: "0.5rem" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "0.25rem",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Validando..." : "Validar código"}
        </button>
      </div>
    </div>
  );
}
