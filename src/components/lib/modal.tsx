// app/components/lib/modal.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    setShowModal: Dispatch<SetStateAction<boolean>>;
    maxWidth?: string;
    dropdownRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Modal({ children, title, description, setShowModal, maxWidth = "450px", dropdownRef }: ModalProps) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
            }}
        >
            <div
                ref={dropdownRef}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "1rem",
                    padding: "2rem",
                    width: "90%",
                    maxWidth: maxWidth,
                    position: "relative",
                }}
            >

                {/* Close button */}
                <button
                    onClick={() => setShowModal(false)}
                    style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        background: "none",
                        border: "none",
                        fontSize: "1rem",
                        cursor: "pointer",
                        color: '#000'
                    }}
                    aria-label="Cerrar modal"
                >
                    <FaTimes />
                </button>
                <h2 className="modal-title">{title}</h2>
                <p className="description">{description}</p>
                {children}
            </div>
        </div>
    );
}
