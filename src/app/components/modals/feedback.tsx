// app/components/modals/feedback.tsx
"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function FeedbackModule({
  setShowFeedbackModal,
}: {
  setShowFeedbackModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const sendFeedback = async (anonymous: boolean) => {
    if (!feedback.trim()) return;
    setSending(true);

    try {
      const res = await fetch("https://lampo-pet-web.vercel.app/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, anonymous }),
      });
      if (!res.ok) throw new Error("Error en el servidor");
      alert("¡Gracias por tu opinión!");
      setShowFeedbackModal(false);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al enviar tu mensaje.");
      setSending(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
          onClick={() => setShowFeedbackModal(false)}
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
        <h2>Queremos leerte</h2>
        <p>Cuéntanos tu experiencia con Lampo o sobre tu mascota.</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            width: "100%",
            minHeight: "4rem",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            marginTop: "0.75rem",
          }}
          disabled={sending}
        />

        {/* Checkbox para envío anónimo */}
        <label style={{ display: "flex", alignItems: "center", marginTop: "0.75rem" }}>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            disabled={sending}
            style={{ marginRight: "0.5rem" }}
          />
          Enviar de forma anónima
        </label>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            onClick={() => sendFeedback(isAnonymous)}
            style={{ flex: 1 }}
            disabled={sending || !feedback.trim()}
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
