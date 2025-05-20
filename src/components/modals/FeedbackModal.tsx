// app/components/modals/FeedbackModal.tsx
"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useAppContext } from "@/app/layout";
import Modal from "../lib/modal";

interface FeedbackModalProps {
  setShowFeedbackModal: Dispatch<SetStateAction<boolean>>;
};

export default function FeedbackModal({ setShowFeedbackModal }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { session } = useAppContext();

  const sendFeedback = async (anonymous: boolean) => {
    if (!feedback.trim()) return;
    setSending(true);

    try {
      const res = await fetch(`${process.env.PROTOCOL}://${process.env.VERCEL_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, anonymous, userEmail: session?.db?.user.email }),
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
    <Modal title="Queremos leerte" description="Cuéntanos tu experiencia con Lampo o sobre tu mascota" setShowModal={setShowFeedbackModal}>
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
    </Modal>
  );
}
