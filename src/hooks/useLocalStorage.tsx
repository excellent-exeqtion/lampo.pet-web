// app/lib/db/hooks/useLocalStorage.tsx
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

/**
 * Hook para manejar un valor en localStorage con encriptación opcional y hash de clave,
 * implementando hidratación para evitar lectura antes del montaje.
 * @param key Clave original para identificar item en storage.
 * @param initialValue Valor inicial si no existe valor en storage.
 * @param options.secret Secreto para encriptar/hashear clave y valor.
 * @returns [valor, setter] donde setter actualiza estado y storage.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { secret?: string }
): [T, (value: T | null) => void] {
  const secret = options?.secret || "";//process.env.NEXT_PUBLIC_STORAGE_SECRET!;
  // Generar clave de storage hasheada si hay secreto
  const storageKey = secret
    ? CryptoJS.SHA256(key + secret).toString()
    : key;

  // Estado para controlar hidratación (cliente montado)
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Estado del valor almacenado
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Al hidratar, leer de localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item === null) {
        setStoredValue(initialValue);
      } else {
        const raw = secret
          ? CryptoJS.AES.decrypt(item, secret).toString(CryptoJS.enc.Utf8)
          : item;
        setStoredValue(JSON.parse(raw) as T);
      }
    } catch {
      setStoredValue(initialValue);
    }
  }, [hydrated, storageKey, initialValue, secret]);

  /**
   * Setter que guarda en estado y en localStorage (o elimina si value es null).
   */
  const setValue = (value: T | null) => {
    if (typeof window === "undefined" || !hydrated) {
      setStoredValue(value as T);
      return;
    }
    try {
      if (value === null) {
        window.localStorage.removeItem(storageKey);
        setStoredValue(initialValue);
      } else {
        const stringValue = JSON.stringify(value);
        const encrypted = secret
          ? CryptoJS.AES.encrypt(stringValue, secret).toString()
          : stringValue;
        window.localStorage.setItem(storageKey, encrypted);
        setStoredValue(value);
      }
    } catch {
      // Ignorar errores de storage
    }
  };

  return [storedValue, setValue];
}
