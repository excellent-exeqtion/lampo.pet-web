// app/vet/[code]/page.tsx
"use client";
import { PetRepository } from "@/repos/pet.repository";
import { PetCodeRepository } from "@/repos/petCode.repository";
import PetEditForm from "./components/forms/PetEditForm";
import { PetType } from "@/types/index";
import { useAppContext } from "@/app/layout";
import { useEffect, useState } from "react";
import { VeterinaryAccessRepository } from "@/repos/veterinaryAccess.repository";

interface VetPageProps {
  params: Promise<{
    code: string;
  }>;
}

export default function VetPage({ params }: VetPageProps) {

  const [validatedCode, setValidatedCode] = useState("");
  const [pet, setPet] = useState<PetType | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");

  const { setStoredPet: setStoredPetId, setStoredVetAccess, setStoredPetCode } = useAppContext();

  useEffect(() => {
    const fetch = async () => {
      const { code } = await params;
      setValidatedCode(code);

      try {
        // 1. Buscar el código
        const codeRecord = await PetCodeRepository.find(code);
        if (!codeRecord) {
          setMessage("Código inválido. Pídele al dueño de la mascota que genere uno nuevo.");
        } else if (new Date(codeRecord.expires_at) < new Date()) {
          // 2. Código expirado
          setMessage("El código ha expirado. Pídele al dueño de la mascota que genere uno nuevo.");
        } else {
          setStoredPetCode(codeRecord);
          // 3. Encontrar la mascota
          const petFound = await PetRepository.findById(codeRecord.pet_id);
          setPet(petFound);
          if (!petFound) {
            setMessage("No se encontró la mascota asociada.");
          } else {
            setStoredPetId(petFound);
            setIsValid(true);
          // 4. Encontrar el veterinario que accedió con el código de la mascota
            const vetAccess = await VeterinaryAccessRepository.findByCodeAndByPetId(code, petFound.id);
            if (vetAccess) setStoredVetAccess(vetAccess);
          }

        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err);
        setMessage("Ocurrió un error al validar el código.");
      }
    }
    fetch();
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
