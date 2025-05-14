// app/components/modals/vet-code.tsx
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { veterinaryStyles } from "css/veterinary";

interface VeterinaryModuleProps {
  setShowVetModal: Dispatch<SetStateAction<boolean>>;
}

export default function VeterinaryModule({ setShowVetModal }: VeterinaryModuleProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    const sanitizedCode = code.replaceAll(" ", "").toUpperCase();
    if (!sanitizedCode) {
      setError("Por favor ingresa un código.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("https://lampo-pet-web.vercel.app/api/vet/use-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: sanitizedCode }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Código inválido o expirado.");
      } else {
        setShowVetModal(false);
        router.push(`/pages/vet/${sanitizedCode}`);
      }
    } catch {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className="modal">
        <button
          className="close-btn"
          onClick={() => setShowVetModal(false)}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        <h2 className="modal-title">Soy médico veterinario</h2>
        <p className="description">
          Aquí puedes revisar el historial completo, modificarlo y agregar entradas
          a la historia de la mascota.
        </p>

        <h4 className="label">Introduce el código de la mascota</h4>
        <input
          className="input-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. U8Y499"
        />

        {error && <p className="error">{error}</p>}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Validando..." : "Validar código"}
        </button>
      </div>

      <style jsx>{veterinaryStyles}</style>
    </div>
  );
}
