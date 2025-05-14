// app/components/modals/pet-code.tsx
"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes, FaShareAlt, FaCopy } from "react-icons/fa";

export default function PetCodeModule({
  setShowCodeModal,
}: {
  setShowCodeModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [code, setCode] = useState("");
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generar() {
    const res = await fetch("https://lampo-pet-web.vercel.app/api/pets/me/code", { method: "POST" });
    const json = await res.json();
    if (json.code) {
      setCode(json.code);
      setShow(true);
      setCopied(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
        }}
      >
        <button
          onClick={() => setShowCodeModal(false)}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
            fontSize: "1rem",
            color: "#000",
            cursor: "pointer",
          }}
        >
          <FaTimes />
        </button>

        <p>
          <strong>Código único de tu mascota</strong>
        </p>

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
          <FaShareAlt size={20} /> Generar código de acceso
        </button>
      </div>
    </div>
  );
}
