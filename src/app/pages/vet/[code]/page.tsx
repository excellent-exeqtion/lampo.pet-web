// app/vet/[code]/page.tsx
import { supabase } from "lib/supabaseClient";
import PetEditForm, { Pet } from "forms/pet-edit-form";

interface Props {
  params: { code: string };
}

export default async function VetPage({ params }: Props) {
  const codeParam = params.code;

  // 1. Look up code record
  const { data: codeData, error: codeError } = await supabase
    .from("pet_codes")
    .select("pet_id, expires_at")
    .eq("code", codeParam)
    .single();

  const now = new Date();
  let isValid = false;
  let pet: Pet | null = null;
  let message = "";

  if (codeError || !codeData) {
    message = "Código inválido. Pídele al dueño que genere uno nuevo.";
  } else {
    const expiresAt = new Date(codeData.expires_at);
    if (expiresAt < now) {
      message = "El código ha expirado. Pídele al dueño que genere uno nuevo.";
    } else {
      // 2. Código válido → fetch pet
      const { data: petData, error: petError } = await supabase
        .from("pets")
        .select("id, name, species, breed, birth_date")
        .eq("id", codeData.pet_id)
        .single();

      if (petError || !petData) {
        message = "No se encontró la mascota asociada.";
      } else {
        pet = petData;
        isValid = true;
      }
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Editar datos de mascota</h1>

      {!isValid && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{message}</p>
      )}

      {pet && (
        <PetEditForm
          code={codeParam}
          pet={pet}
          disabled={!isValid}
        />
      )}
    </main>
  );
}
