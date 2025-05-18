// app/components/modals/VeterinaryModal.tsx
"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { veterinaryStyles } from "../../styles/veterinary";

interface VeterinaryModalProps {
  setShowVetModal: Dispatch<SetStateAction<boolean>>;
}

export default function VeterinaryModal({ setShowVetModal }: VeterinaryModalProps) {
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registration, setRegistration] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    const sanitizedCode = code.replaceAll(" ", "").toUpperCase();
    if (![sanitizedCode, firstName, lastName, registration, clinicName, city].every(Boolean)) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.PROTOCOL}://${process.env.VERCEL_URL}/api/vet/use-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: sanitizedCode,
            firstName,
            lastName,
            registration,
            clinicName,
            city,
          }),
        }
      );
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
      <div className="modal" style={{ maxWidth: '1000px', width: '100%' }}>
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

        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <h4 className="label">Nombre</h4>
            <input
              className="input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Nombre"
            />
          </div>

          <div>
            <h4 className="label">Apellido</h4>
            <input
              className="input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Apellido"
            />
          </div>

          <div>
            <h4 className="label">Registro profesional</h4>
            <input
              className="input"
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="Número de registro"
            />
          </div>

          <div>
            <h4 className="label">Clínica / Laboratorio</h4>
            <input
              className="input"
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Nombre de la clínica"
            />
          </div>

          <div>
            <h4 className="label">Ciudad</h4>
            <input
              className="input"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ciudad"
            />
          </div>

          <div>
            <h4 className="label">Código de la mascota</h4>
            <input
              className="input-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. U8Y499"
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar acceso"}
        </button>
      </div>

      <style jsx>{veterinaryStyles}</style>
    </div>
  );
}
