// src/components/modals/AlertModal.tsx
import React from "react";
import ModalComponent from "../lib/modal";
import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

interface AlertModalProps {
    title: string;
    message: string;
    type: 'warning' | 'info';
    onClose: () => void;
}

export default function AlertModal({ title, message, type, onClose }: AlertModalProps) {
    const icon = type === 'warning'
        ? <FaExclamationTriangle size={32} style={{ color: 'var(--primary-yellow)', flexShrink: 0 }} />
        : <FaInfoCircle size={32} style={{ color: 'var(--pico-primary)', flexShrink: 0 }} />;

    return (
        <ModalComponent setShowModal={() => onClose()} title="">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {icon}
                <div>
                    <h2 className="modal-title" style={{ marginTop: 0 }}>{title}</h2>
                    <p className="modal-description">{message}</p>
                </div>
            </div>
            <button onClick={onClose} style={{ width: '100%', marginTop: '1rem' }}>
                Entendido
            </button>
        </ModalComponent>
    );
}