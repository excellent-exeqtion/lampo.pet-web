"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/layout/ClientAppProvider";
import PetEditForm from "./components/forms/PetEditForm";
import { PetType } from "@/types/index";

interface VetPageProps {
  params: Promise<{ code: string }>;
}

export default function VetPage({ params }: VetPageProps) {
  const [validatedCode, setValidatedCode] = useState("");
  const [pet, setPet] = useState<PetType | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");

  const { storageContext } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      const { code } = await params;
      setValidatedCode(code);

      try {
        const res = await fetch(`/api/vet-access/validate?code=${code}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setMessage(data.message || "Error validando el código.");
          return;
        }

        storageContext.setStoredPetCode(data.codeRecord);
        storageContext.setStoredPet(data.pet);
        if (data.vetAccess) {
          storageContext.setStoredVetAccess(data.vetAccess);
        }

        setPet(data.pet);
        setIsValid(true);
      } catch (err) {
        console.error("Error validando código veterinario:", err);
        setMessage("Ocurrió un error al validar el código.");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <h1>Editar datos de mascota</h1>

      {!isValid && (
        <p style={{ marginBottom: "1rem", color: "red" }}>
          {message}
        </p>
      )}

      {pet && (
        <PetEditForm code={validatedCode} pet={pet} disabled={!isValid} />
      )}
    </main>
  );
}
