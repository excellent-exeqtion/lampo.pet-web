// src/utils/random.tsx
import { customAlphabet } from "nanoid";

// Define un alfabeto con dígitos y letras (mayúsculas + minúsculas)
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Crea un generador de IDs de 6 caracteres
export const generateCode = customAlphabet(ALPHABET, 6);


/**
 * Genera un ID aleatorio que cumple el patrón: letra + 3 dígitos (e.g. A012, z999).
 */
function randomPetId(): string {
  const letter = LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  const number = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `${letter}${number}`;
}

/**
 * Genera un ID único para mascota, repitiendo hasta que no exista en la base de datos.
 */
export async function generateUniquePetId(): Promise<string> {
  let candidate: string;
  let exists: boolean;

  do {
    candidate = randomPetId();

    const res = await fetch(`/api/pets/exists?id=${candidate}`);
    const data = await res.json();
    exists = data.exists;
  } while (exists);

  return candidate;
}