"use client";
import React from "react";
import {
    FaShareAlt,
    FaCommentDots,
    FaUserMd
} from "react-icons/fa";

export default function BubblesModule({ setShowFeedbackModal, setShowVetModal, setShowCodeModal }: { setShowFeedbackModal: any, setShowVetModal: any, setShowCodeModal: any }) {
    return (
        <div style={{ position: "fixed", right: "1rem", top: "auto", bottom: "1rem", display: "flex", flexDirection: "column", gap: "1rem", zIndex: 1500 }}>
            {/* Feedback Bubble */}
            <div className="tooltip-container" draggable>
                <button
                    onClick={() => setShowFeedbackModal(true)}
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgb(1, 114, 173)",
                        borderRadius: "50%",
                        padding: "0.75rem",
                        color: "rgb(1, 114, 173)",
                        fontSize: "1.25rem",
                        cursor: "pointer",
                    }}
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
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgb(1, 114, 173)",
                        borderRadius: "50%",
                        padding: "0.75rem",
                        color: "rgb(1, 114, 173)",
                        fontSize: "1.25rem",
                        cursor: "pointer",
                    }}
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
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgb(1, 114, 173)",
                        borderRadius: "50%",
                        padding: "0.75rem",
                        color: "rgb(1, 114, 173)",
                        fontSize: "1.25rem",
                        cursor: "pointer",
                    }}
                    aria-label="Código único"
                >
                    <FaShareAlt />
                </button>
                <span className="tooltip-text">Código único de tu mascota</span>
            </div>
        </div>
    );
}
