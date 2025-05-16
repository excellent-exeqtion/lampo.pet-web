// app/lib/codeGenerator.tsx
import { customAlphabet } from "nanoid";

// Define un alfabeto con dígitos y letras (mayúsculas + minúsculas)
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Crea un generador de IDs de 6 caracteres
export const generateCode = customAlphabet(ALPHABET, 6);
