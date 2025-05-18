// app/components/modals/ChangePetModal.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaTimes } from "react-icons/fa";
import { useAppContext } from "@/app/layout";

export default function ChangePetModal({
  setShowChangePetModal,
}: {
  setShowChangePetModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { ownerPets, selectedPet, setSelectedPet } = useAppContext();

  console.log(ownerPets);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "1rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
        }}
      >
        <button
          onClick={() => setShowChangePetModal(false)}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
            fontSize: "1rem",
            color: "#000",
            cursor: "pointer",
          }}
        >
          <FaTimes />
        </button>

        <p>
          <strong>Cambia la mascota que deseas visualizar: </strong>
        </p>

        <select
          value={selectedPet?.id}
          onChange={(e) => setSelectedPet(ownerPets?.filter(x => x.id == e.target.value)[0] ?? null)}
          style={{ border: 'none', paddingLeft: '0' }}
          className="pet-dropdown"
        >
          {ownerPets?.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

      </div>
    </div >
  );
}

/*

              <Image
                src={selectedPet?.image ?? '/pets/pet.png'}
                alt="profile"
                width={80}
                height={80}
                style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }} />
                {pet.name}
                */