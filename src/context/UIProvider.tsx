// src/context/UIProvider.tsx
"use client";
import { useState, createContext, useContext } from "react";

export interface UIState {
    showVetModal: boolean;
    setShowVetModal: React.Dispatch<React.SetStateAction<boolean>>;
    showCodeModal: boolean;
    setShowCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
    showFeedbackModal: boolean;
    setShowFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
    showChangePetModal: boolean;
    setShowChangePetModal: React.Dispatch<React.SetStateAction<boolean>>;
    showAddPetModal: boolean;
    setShowAddPetModal: React.Dispatch<React.SetStateAction<boolean>>;
    showEditPetModal: boolean;
    setShowEditPetModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UIContext = createContext({} as UIState);
export const useUI = () => useContext(UIContext);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [showVetModal, setShowVetModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showChangePetModal, setShowChangePetModal] = useState(false);
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const [showEditPetModal, setShowEditPetModal] = useState(false);

    return (
        <UIContext.Provider value={{
            showVetModal,
            setShowVetModal,
            showCodeModal,
            setShowCodeModal,
            showFeedbackModal,
            setShowFeedbackModal,
            showChangePetModal,
            setShowChangePetModal,
            showAddPetModal,
            setShowAddPetModal,
            showEditPetModal,
            setShowEditPetModal
        }}>
            {children}
        </UIContext.Provider>
    );
}
