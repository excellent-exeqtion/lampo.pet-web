// app/vet/[code]/page.tsx
import PetEditForm from "@/app/pages/vet/[code]/components/forms/pet-edit-form";
import { Pet } from "@/lib/db/repositories";
import { PetRepository } from "@/lib/db/repositories/pet.repository";
import { PetCodeRepository } from "@/lib/db/repositories/petCode.repository";

interface VetPageProps {
  params: { code: string };
}

export default async function VetPage({ params: { code } }: VetPageProps) {
  let pet: Pet | null = null;
  let message = "";
  let isValid = false;

  try {
    // 1. Buscar el código
    const codeRecord = await PetCodeRepository.find(code);
    if (!codeRecord) {
      message = "Código inválido. Pídele al dueño que genere uno nuevo.";
    } else if (new Date(codeRecord.expires_at) < new Date()) {
      // 2. Código expirado
      message = "El código ha expirado. Pídele al dueño que genere uno nuevo.";
    } else {
      pet = await PetRepository.findById(codeRecord.pet_id);
      if (!pet) {
        message = "No se encontró la mascota asociada.";
      } else {
        isValid = true;
      }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    message = "Ocurrió un error al validar el código.";
  }

  return (
    <main className="container" style={{ padding: "2rem" }}>
      <h1>Editar datos de mascota</h1>

      {!isValid && (
        <p className="text-error" style={{ marginBottom: "1rem" }}>
          {message}
        </p>
      )}

      {pet && (
        <PetEditForm code={code} pet={pet} disabled={!isValid} />
      )}
    </main>
  );
}
