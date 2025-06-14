// src/components/modals/ConfirmModal.tsx
import React from "react";
import ModalComponent from "../lib/modal";
import { FaQuestionCircle } from "react-icons/fa";

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }: ConfirmModalProps) {
    return (
        <ModalComponent setShowModal={() => onCancel()} title="">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <FaQuestionCircle size={32} style={{ color: 'var(--pico-primary)', flexShrink: 0 }} />
                <div>
                    <h2 className="modal-title" style={{ marginTop: 0 }}>{title}</h2>
                    <p className="modal-description">{message}</p>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={onCancel} className="secondary" style={{ flex: 1 }}>
                    {cancelText}
                </button>
                <button onClick={onConfirm} style={{ flex: 1 }}>
                    {confirmText}
                </button>
            </div>
        </ModalComponent>
    );
}