// app/pages/vet/[code]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useStorageContext } from "@/context/StorageProvider";
import PetEditForm from "./components/forms/PetEditForm";
import { PetType } from "@/types/index";
import { useRouter } from "next/navigation";

interface VetPageProps {
  params: Promise<{ code: string }>;
}

export default function VetPage({ params }: VetPageProps) {
  const [validatedCode, setValidatedCode] = useState("");
  const [pet, setPet] = useState<PetType | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const storage = useStorageContext();

  useEffect(() => {
    const fetchData = async () => {
      const { code } = await params;
      setValidatedCode(code);

      try {
        const res = await fetch(`/api/vet/validate?code=${code}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setMessage(data.message || "Error validando el código.");
          return;
        }

        storage.setStoredPetCode(data.codeRecord);
        storage.setStoredPet(data.pet);
        if (data.vetAccess) {
          storage.setStoredVetAccess(data.vetAccess);
        }

        setPet(data.pet);
        router.replace(`/pages/vet/consultation/${data.pet.id}`);
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
        <p style={{ marginBottom: "1rem", color: "var(--primary-red)" }}>
          {message}
        </p>
      )}

      {pet && (
        <PetEditForm code={validatedCode} pet={pet} disabled={!isValid} />
      )}
    </main>
  );
}
