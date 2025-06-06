// src/context/UIProvider.tsx
"use client";
import { useState, createContext, useContext, SetStateAction } from "react";
import { useStorageContext } from "./StorageProvider";

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
    showVetPetCodeModal: boolean;
    setShowVetPetCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
    showPlanModal: boolean;
    setShowPlanModal: React.Dispatch<React.SetStateAction<boolean>>;
    showInviteUserModal: boolean;
    setShowInviteUserModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMissingPetModal: boolean;
    setShowMissingPetModal: React.Dispatch<React.SetStateAction<boolean>>;
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
    const [showVetPetCodeModal, setShowVetPetCodeModal] = useState(false);
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [showInviteUserModal, setShowInviteUserModal] = useState(false);
    const [showMissingPetModal, setShowMissingPetModal] = useState(false);
    const storage = useStorageContext();

    const closeEditPetModal: React.Dispatch<React.SetStateAction<boolean>> = (close: SetStateAction<boolean>) => {
        if (!close) {
            storage.resetPet();
        }
        return setShowEditPetModal(close);
    }

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
            setShowEditPetModal: closeEditPetModal,
            showVetPetCodeModal,
            setShowVetPetCodeModal,
            showPlanModal,
            setShowPlanModal,
            showInviteUserModal,
            setShowInviteUserModal,
            showMissingPetModal,
            setShowMissingPetModal,
        }}>
            {children}
        </UIContext.Provider>
    );
}
