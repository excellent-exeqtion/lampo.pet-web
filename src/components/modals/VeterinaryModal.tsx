// app/components/modals/VeterinaryModal.tsx
"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { veterinaryStyles } from "../../styles/veterinary";
import ModalComponent from "../lib/modal";
import { useAppContext } from "../layout/ClientAppProvider";
import { postFetch, getFetch } from "@/app/api";

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
  const { storageContext } = useAppContext();

  const handleSubmit = async () => {
    setError("");
    const sanitizedCode = code.replaceAll(" ", "").toUpperCase();
    if (![sanitizedCode, firstName, lastName, registration, clinicName, city].every(Boolean)) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);

    try {
      const codeResponse = await postFetch(
        '/api/vet/use-code',
        undefined,
        {
          code: sanitizedCode,
          firstName,
          lastName,
          registration,
          clinicName,
          city
        }
      );
      const codeData = await codeResponse.json();

      if (!codeResponse.ok || codeData.error) {
        setError(codeData.error || "Código inválido o expirado.");
      } else {
        const petResponse = await getFetch(`/api/pets/${codeData.pet_id}`);

        if (!petResponse.ok) {
          setError("No se encontró la mascota.");
        }
        const petData = await petResponse.json();

        storageContext.setStoredPet(petData)
        storageContext.setStoredOwnerPets([]);
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
    <ModalComponent title="Soy médico veterinario" description="Aquí puedes revisar el historial completo, modificarlo y agregar entradas
        a la historia de la mascota" setShowModal={setShowVetModal} maxWidth="1000px">

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
        {loading ? "Guardando..." : "Acceder"}
      </button>

      <style jsx>{veterinaryStyles}</style>
    </ModalComponent>
  );
}
