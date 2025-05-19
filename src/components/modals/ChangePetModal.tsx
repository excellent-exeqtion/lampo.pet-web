// app/components/modals/ChangePetModal.tsx
"use client";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  useEffect,
} from "react";
import { FaTimes, FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";
import { useAppContext } from "@/app/layout";
import Image from 'next/image'
import { PetType } from "@/types/index";

interface ChangePetModalProps {
  setShowChangePetModal: Dispatch<SetStateAction<boolean>>;
};

export default function ChangePetModal({ setShowChangePetModal }: ChangePetModalProps) {
  const { storedOwnerPets, selectedPet, setStoredPet: setStoredPetId, setStoredVetAccess } = useAppContext();
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
    setStoredPetId(pet);
    setIsOpen(false);
    setShowChangePetModal(false);
    setStoredVetAccess(null);
  };

  const addPet = () => {

  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        ref={dropdownRef}
        style={{
          backgroundColor: "#fff",
          borderRadius: "1rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setShowChangePetModal(false)}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            background: "none",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: '#000'
          }}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        <p style={{ paddingTop: '20px' }}>
          <strong>Selecciona a la mascota que le deseas visualizar los datos</strong>
        </p>

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
                src={selectedPet?.image ?? "/pets/pet.png"}
                alt={selectedPet?.name ?? "Sin mascota"}
                width={40}
                height={40}
                style={{
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
                    src={pet.image ?? '/pets/pet.png'}
                    alt={pet.name}
                    width={32}
                    height={32}
                    style={{
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
      </div>
    </div>
  );
}
