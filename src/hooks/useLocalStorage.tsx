// app/lib/db/hooks/useLocalStorage.tsx
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

/**
 * Hook para manejar un valor en localStorage con encriptación opcional y hash de clave,
 * implementando hidratación segura para evitar errores de SSR.
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
  const secret = options?.secret || (process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === 'false' ? '' : process.env.NEXT_PUBLIC_STORAGE_SECRET!);

  const getStorageKey = () => {
    return secret ? CryptoJS.SHA256(key + secret).toString() : key;
  };

  // 1. El estado inicial SIEMPRE es el valor por defecto. Nunca leemos de localStorage aquí.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. La lectura de localStorage ocurre DESPUÉS del montaje, solo en el cliente.
  useEffect(() => {
    // Verificar si estamos en el navegador
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storageKey = getStorageKey();
      const item = window.localStorage.getItem(storageKey);

      if (item !== null) {
        const raw = secret
          ? CryptoJS.AES.decrypt(item, secret).toString(CryptoJS.enc.Utf8)
          : item;
        setStoredValue(JSON.parse(raw));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      // Mantenemos el valor inicial si hay un error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array de dependencias vacío asegura que esto solo se ejecute una vez en el cliente.


  const setValue = (value: T | null) => {
    // Si estamos en el servidor, solo actualizamos el estado en memoria.
    if (typeof window === "undefined") {
      console.warn(`Attempted to set localStorage key “${key}” on the server.`);
      setStoredValue(value as T); // Actualizar estado para consistencia si es necesario
      return;
    }

    try {
      const storageKey = getStorageKey();
      if (value === null) {
        window.localStorage.removeItem(storageKey);
        setStoredValue(initialValue); // Volver al valor inicial
      } else {
        const stringValue = JSON.stringify(value);
        const encrypted = secret
          ? CryptoJS.AES.encrypt(stringValue, secret).toString()
          : stringValue;
        window.localStorage.setItem(storageKey, encrypted);
        setStoredValue(value);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}