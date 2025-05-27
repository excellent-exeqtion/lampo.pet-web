// app/components/modals/Bubbles.tsx
"use client"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaShareAlt, FaCommentDots, FaUserMd, FaExchangeAlt } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";
import PetCodeModal from "./PetCodeModal";
import VeterinaryModal from "./VeterinaryModal";
import ChangePetModal from "./ChangePetModal";
import AddPetModal from "./AddPetModal";
import { useAppContext } from "../layout/ClientAppProvider";
import { isOwner, isVet } from "@/utils/roles";

interface BubblesProps {
  setShowFeedbackModal: Dispatch<SetStateAction<boolean>>;
  showFeedbackModal: boolean;
  setShowVetModal: Dispatch<SetStateAction<boolean>>;
  showVetModal: boolean;
  setShowCodeModal: Dispatch<SetStateAction<boolean>>;
  showCodeModal: boolean;
  setShowChangePetModal: Dispatch<SetStateAction<boolean>>;
  showChangePetModal: boolean;
  setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
  showAddPetModal: boolean;
  setShowEditPetModal: Dispatch<SetStateAction<boolean>>;
  showEditPetModal: boolean;
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

export default function Bubbles({
  setShowFeedbackModal,
  showFeedbackModal,
  setShowVetModal,
  showVetModal,
  setShowCodeModal,
  showCodeModal,
  setShowChangePetModal,
  showChangePetModal,
  setShowAddPetModal,
  showAddPetModal,
  setShowEditPetModal,
  showEditPetModal,
}: BubblesProps) {

  const { storageContext, session } = useAppContext();
  const [showChangePetBubble, setShowChangePetBubble] = useState(false);

  useEffect(() => {
    const show = (storageContext.storedOwnerPets.length ?? 0) > 0;
    setShowChangePetBubble(show);
  }, [storageContext.storedOwnerPets]);

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
        <span className="tooltip-text tooltip-left">Enviar feedback</span>
      </div>

      {/* Vet Bubble */}
      {isOwner(session) && !isVet(session, storageContext.storedVetAccess) &&
        <div className="tooltip-container" draggable>
          <button
            onClick={() => setShowVetModal(true)}
            style={bubbleStyleBase}
            aria-label="Veterinario"
          >
            <FaUserMd />
          </button>
          <span className="tooltip-text tooltip-left">Soy médico veterinario</span>
        </div>
      }

      {/* Code Bubble */}
      {isOwner(session) && !isVet(session, storageContext.storedVetAccess) &&
        <div className="tooltip-container" draggable>
          <button
            onClick={() => setShowCodeModal(true)}
            style={bubbleStyleBase}
            aria-label="Código único"
          >
            <FaShareAlt />
          </button>
          <span className="tooltip-text tooltip-left">Genera un código único para tu veterinario</span>
        </div>
      }

      {/* Change Pet Bubble */}
      {showChangePetBubble &&
        <div className="tooltip-container" draggable>
          <button
            onClick={() => setShowChangePetModal(true)}
            style={bubbleStyleBase}
            aria-label="Cambia de mascota"
          >
            <FaExchangeAlt />
          </button>
          <span className="tooltip-text tooltip-left">Cambia de mascota</span>
        </div>
      }

      {/* Modals */}
      {showChangePetModal && <ChangePetModal setShowChangePetModal={setShowChangePetModal} setShowAddPetModal={setShowAddPetModal} />}
      {showVetModal && <VeterinaryModal setShowVetModal={setShowVetModal} />}
      {showCodeModal && <PetCodeModal setShowCodeModal={setShowCodeModal} />}
      {showFeedbackModal && <FeedbackModal setShowFeedbackModal={setShowFeedbackModal} />}
      {showAddPetModal && <AddPetModal showAddPetModal={showAddPetModal} setShowAddPetModal={setShowAddPetModal} />}
      {showEditPetModal && <AddPetModal editPet={storageContext.storedPet} showAddPetModal={showAddPetModal} setShowAddPetModal={setShowEditPetModal} />}
    </div>
  );
}
