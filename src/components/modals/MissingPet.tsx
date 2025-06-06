import React from "react";
import ModalComponent from "@/components/lib/modal";
import { useUI } from "@/context/UIProvider";

export default function MissingPetModal() {
    const { setShowMissingPetModal, setShowAddPetModal } = useUI();

    function handleGoToAddPet() {
        setShowAddPetModal(true);
        setShowMissingPetModal(false);
    }

    return (
        <ModalComponent
            title="Registra tu primera mascota"
            description="Para comenzar a aprovechar Lampo, registra la información de tu primera mascota."
            setShowModal={setShowMissingPetModal}
            hideClose={true}
        >
            <button
                className="contrast"
                onClick={handleGoToAddPet}
                style={{ width: "100%", marginTop: "1rem" }}
            >
                Registrar mascota
            </button>
        </ModalComponent>
    );
}
