// app/components/modals/bubbles.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaShareAlt, FaCommentDots, FaUserMd } from "react-icons/fa";
import FeedbackModule from "./feedback";
import PetCodeModule from "./pet-code";
import VeterinaryModule from "./veterinary";

interface BubblesProps {
  setShowFeedbackModal: Dispatch<SetStateAction<boolean>>;
  showFeedbackModal: boolean;
  setShowVetModal: Dispatch<SetStateAction<boolean>>;
  showVetModal: boolean;
  setShowCodeModal: Dispatch<SetStateAction<boolean>>;
  showCodeModal: boolean;
}

const bubbleStyleBase: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgb(1, 114, 173)",
  borderRadius: "50%",
  width: "3rem",
  height: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgb(1, 114, 173)",
  fontSize: "1.25rem",
  cursor: "pointer",
};

export default function BubblesModule({
  setShowFeedbackModal,
  showFeedbackModal,
  setShowVetModal,
  showVetModal,
  setShowCodeModal,
  showCodeModal,
}: BubblesProps) {
  return (
    <div
      style={{
        position: "fixed",
        right: "1rem",
        bottom: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        zIndex: 1500,
      }}
    >
      {/* Feedback Bubble */}
      <div className="tooltip-container" draggable>
        <button
          onClick={() => setShowFeedbackModal(true)}
          style={bubbleStyleBase}
          aria-label="Feedback"
        >
          <FaCommentDots />
        </button>
        <span className="tooltip-text">Enviar feedback</span>
      </div>

      {/* Vet Bubble */}
      <div className="tooltip-container" draggable>
        <button
          onClick={() => setShowVetModal(true)}
          style={bubbleStyleBase}
          aria-label="Veterinario"
        >
          <FaUserMd />
        </button>
        <span className="tooltip-text">Soy médico veterinario</span>
      </div>

      {/* Code Bubble */}
      <div className="tooltip-container" draggable>
        <button
          onClick={() => setShowCodeModal(true)}
          style={bubbleStyleBase}
          aria-label="Código único"
        >
          <FaShareAlt />
        </button>
        <span className="tooltip-text">Código único de tu mascota</span>
      </div>

      {/* Modals */}
      {showFeedbackModal && (
        <FeedbackModule setShowFeedbackModal={setShowFeedbackModal} />
      )}
      {showVetModal && <VeterinaryModule setShowVetModal={setShowVetModal} />}
      {showCodeModal && <PetCodeModule setShowCodeModal={setShowCodeModal} />}
    </div>
  );
}
