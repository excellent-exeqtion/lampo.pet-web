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
import { useAppContext } from "../layout/ClientAppProvider";
import { PetType } from "@/types/index";
import Modal from "../lib/modal";
import { Empty } from "@/data/index";
import { CircularImage } from "@/components/index"

interface ChangePetModalProps {
  setShowChangePetModal: Dispatch<SetStateAction<boolean>>;
  setShowAddPetModal: Dispatch<SetStateAction<boolean>>;
};

export default function ChangePetModal({ setShowChangePetModal, setShowAddPetModal }: ChangePetModalProps) {
  const { storageContext } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    storageContext.setStoredPet(pet);
    storageContext.resetPet();
    setIsOpen(false);
    setShowChangePetModal(false);
    storageContext.setStoredVetAccess(Empty.VetAccess());
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
            <CircularImage
              src={storageContext.storedPet.image || "/pets/pet.jpg"}
              width={60}
              borderSize="3px" />
            <span style={{ color: '#000', marginLeft: '10px' }}>
              {storageContext.storedPet.name ?? "Selecciona una mascota"}
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
            {storageContext.storedOwnerPets.map((pet) => (
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
                <CircularImage
                  src={pet.image || "/pets/pet.jpg"}
                  width={50}
                  borderSize="3px" />
                <span style={{ color: '#000', marginLeft: '8px' }}>{pet.name}</span>
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
