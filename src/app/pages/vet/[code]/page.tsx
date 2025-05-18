// app/vet/[code]/page.tsx
import { PetRepository } from "@/repos/pet.repository";
import { PetCodeRepository } from "@/repos/petCode.repository";
import PetEditForm from "./components/forms/PetEditForm";
import { PetType } from "@/types/index";

interface VetPageProps {
  params: { code: string };
}

export default async function VetPage({ params }: VetPageProps) {
  const { code } = params; // Destructuring code from params
  let pet: PetType | null = null;
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
        <p style={{ marginBottom: "1rem", color: "red" }}>
          {message}
        </p>
      )}

      {pet && (
        <PetEditForm code={code} pet={pet} disabled={!isValid} />
      )}
    </main>
  );
}
