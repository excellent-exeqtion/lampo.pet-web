"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";

export default function FeedbackModule({ setShowFeedbackModal }: { setShowFeedbackModal: Dispatch<SetStateAction<boolean>> }) {
    return (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
                <button onClick={() => setShowFeedbackModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1rem", color: "#000", cursor: "pointer" }}>
                    <FaTimes />
                </button>
                <h2>Queremos leerte</h2>
                <p>Cuéntanos tu experiencia con Lampo o sobre tu mascota.</p>
                <textarea style={{ width: "100%", minHeight: "4rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.75rem" }} />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button style={{ flex: 1 }}>Enviar</button>
                    <button style={{ flex: 1 }}>Anónimo</button>
                </div>
            </div>
        </div>
    );
}
