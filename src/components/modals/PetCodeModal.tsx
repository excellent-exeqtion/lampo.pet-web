// app/components/modals/PetCodeModal.tsx
"use client";
import React, { useState } from "react";
import { FaShareAlt, FaCopy } from "react-icons/fa";
import ModalComponent from "../lib/modal";
import { useStorageContext } from "@/context/StorageProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { postFetch } from "@/app/api";
import { useUI } from "@/context/UIProvider";

export default function PetCodeModal() {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const session = useSessionContext();
  const storage = useStorageContext();
  const { setShowCodeModal } = useUI();

  async function generar() {
    setError("");
    try {
      const res = await postFetch('/api/pets/me/code', undefined, { owner_id: session?.db?.user.id, pet_id: storage.storedPet.id });

      if (res.status === 404) {
        setError("No se encontró la mascota.");
        return;
      }
      if (!res.ok) {
        setError("Error al generar el código.");
        return;
      }

      const json = await res.json();
      if (json.code) {
        setCode(json.code);
        setShow(true);
        setCopied(false);
      } else {
        setError("Respuesta inválida del servidor.");
      }
    } catch (e) {
      console.error(e);
      setError("Ocurrió un error al generar el código.");
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <ModalComponent title="Generar código" setShowModal={setShowCodeModal}>

      {!show &&
        <p style={{ fontSize: "0.8rem" }}>
          Este es un código dinámico de acesso para que tu veterinario pueda editar la información clínica de tu mascota.
        </p>
      }

      {error && (
        <p style={{ color: "red", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}

      {show && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {code.split("").map((char, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  width: "2rem",
                  padding: "0.5rem 0",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  color: "#007BFF",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                {char}
              </span>
            ))}

            <button
              onClick={handleCopy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
              }}
              title="Copiar código"
            >
              <FaCopy size={20} color={copied ? "green" : "#007BFF"} />
            </button>
          </div>

          {copied && (
            <p style={{ color: "green", marginBottom: "0.5rem", fontSize: "0.8rem" }}>
              ¡Código copiado!
            </p>
          )}

          <p style={{ fontSize: "0.8rem" }}>
            Este código es único para cada mascota. Compártelo con tu médico veterinario para brindarle acceso al historial.
          </p>

        </>
      )}

      {!show &&
        <button
          onClick={generar}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <FaShareAlt size={20} /> Generar
        </button>
      }
    </ModalComponent>
  );
}
