// app/components/modals/ChangePetModal.tsx
"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { useAppContext } from "@/app/layout";
import Image from 'next/image'
import { PetType } from "@/types/index";
import Modal from "../lib/modal";

interface ChangePetModalProps {
  setShowChangePetModal: Dispatch<SetStateAction<boolean>>;
  setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
};

export default function ChangePetModal({ setShowChangePetModal, setShowAddPetModal }: ChangePetModalProps) {
  const { storedOwnerPets, selectedPet, setStoredPet: setStoredPetId, setStoredVetAccess } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(storedOwnerPets)
  // close dropdown if you click outside
  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(ev.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (pet: PetType) => {
    setStoredPetId(pet);
    setIsOpen(false);
    setShowChangePetModal(false);
    setStoredVetAccess(null);
  };

  const addPet = () => {
    setShowChangePetModal(false);
    setShowAddPetModal(true);
  };

  return (
    <Modal title="Selecciona la mascota" description="Visualiza la información de la mascota seleccionada" setShowModal={setShowChangePetModal} dropdownRef={dropdownRef}>
      {/* Custom dropdown */}
      <div style={{ position: "relative", marginTop: "1rem" }}>
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image
              loading={"lazy"}
              src={selectedPet?.image || '/pets/pet.png'}
              alt={selectedPet?.name ?? "Sin mascota"}
              width="40" height="40"
              style={{
                width: "auto",
                height: "auto",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "0.75rem",
              }}
            />
            <span style={{ color: '#000' }}>
              {selectedPet?.name ?? "Selecciona una mascota"}
            </span>
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {isOpen && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              maxHeight: 200,
              overflowY: "auto",
              marginTop: "0.25rem",
              zIndex: 2010,
              padding: 0,
              listStyle: "none",
            }}
          >
            {storedOwnerPets?.map((pet) => (
              <li
                className="pet-selection"
                key={pet.id}
                onClick={() => handleSelect(pet)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                }}
              >
                <Image
                  loading={"lazy"}
                  src={pet.image || '/pets/pet.png'}
                  alt={pet.name}
                  width="32" height="32"
                  style={{
                    width: "auto",
                    height: "auto",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "0.75rem",
                  }}
                />
                <span style={{ color: '#000' }}>{pet.name}</span>
              </li>
            ))}
            <li
              className="pet-selection"
              onClick={addPet}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}>
              <FaPlus />
              <span style={{ color: '#000', marginLeft: '20px' }}>Agregar mascota</span>
            </li>
          </ul>
        )}

      </div>
    </Modal>
  );
}
