// app/components/modals/Bubbles.tsx
"use client"
import React, { useEffect, useState } from "react";
import { FaShareAlt, FaCommentDots, FaUserMd, FaExchangeAlt, FaUserPlus } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";
import PetCodeModal from "./PetCodeModal";
import VeterinaryModal from "./VeterinaryModal";
import ChangePetModal from "./ChangePetModal";
import AddPetModal from "./AddPetModal";
import { useUI } from "@/context/UIProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useRoleContext } from "@/context/RoleProvider";
import VeterinarianPetCodeModal from "./VeterinarianPetCodeModal";
import PlanSelectModal from "./PlanSelectModal";
import InviteUserModal from "./InviteUserModal";
import MissingPetModal from "./MissingPet";

const bubbleStyleBase: React.CSSProperties = {
  backgroundColor: "var(--primary-inverse)",
  border: "1px solid var(--pico-primary)",
  borderRadius: "50%",
  width: "3rem",
  height: "3rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--pico-primary)",
  fontSize: "1.25rem",
  cursor: "pointer",
};

export default function Bubbles() {

  const [showChangePetBubble, setShowChangePetBubble] = useState(false);
  const { isOwner, isVet } = useRoleContext();


  const storage = useStorageContext();

  const { setShowFeedbackModal,
    showFeedbackModal,
    setShowVetModal,
    showVetModal,
    setShowCodeModal,
    showCodeModal,
    setShowChangePetModal,
    showChangePetModal,
    showAddPetModal,
    showEditPetModal,
    setShowVetPetCodeModal,
    showVetPetCodeModal,
    showPlanModal,
    showInviteUserModal,
    setShowInviteUserModal,
    showMissingPetModal
  } = useUI();

  useEffect(() => {
    const show = (storage.storedOwnerPets.length ?? 0) > 0;
    setShowChangePetBubble(show);
  }, [storage.storedOwnerPets]);

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

      {/* //TODO: create admin user, and enable other users to invite another users.*/ }
      {showInviteUserModal &&
        <div className="tooltip-container" draggable>
          <button
            onClick={() => setShowInviteUserModal(true)}
            style={bubbleStyleBase}
            aria-label="Invita a un amigo"
          >
            <FaUserPlus />
          </button>
          <span className="tooltip-text tooltip-left">Invita a un amigo</span>
        </div>
      }

      {/* Vet Bubble */}
      {isOwner && !isVet && storage.storedPet.id &&
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

      {/* Vet Bubble */}
      {isVet &&
        <div className="tooltip-container" draggable>
          <button
            onClick={() => setShowVetPetCodeModal(true)}
            style={bubbleStyleBase}
            aria-label="Veterinario"
          >
            <FaUserMd />
          </button>
          <span className="tooltip-text tooltip-left">Ingresar código de una mascota</span>
        </div>
      }

      {/* Code Bubble */}
      {isOwner && !isVet && storage.storedPet.id &&
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
      {showChangePetModal && <ChangePetModal />}
      {showVetModal && <VeterinaryModal setShowModal={setShowVetModal}/>}
      {showCodeModal && <PetCodeModal />}
      {showFeedbackModal && <FeedbackModal />}
      {showAddPetModal && <AddPetModal />}
      {showEditPetModal && <AddPetModal editPet={storage.storedPet} />}
      {showVetPetCodeModal && <VeterinarianPetCodeModal setShowVetPetCodeModal={setShowVetPetCodeModal}/>}
      {showPlanModal && <PlanSelectModal />}
      {showInviteUserModal && <InviteUserModal />}
      {showMissingPetModal && <MissingPetModal />}
    </div>
  );
}
