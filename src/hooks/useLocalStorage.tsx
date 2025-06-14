// src/hooks/useLocalStorage.tsx
import { useState, useEffect, useCallback } from "react";
import CryptoJS from "crypto-js";

/**
 * Hook a prueba de SSR para manejar un valor en localStorage.
 * Siempre devuelve el valor inicial en el servidor y se hidrata de forma segura en el cliente.
 * @param key Clave original para identificar item en storage.
 * @param initialValue Valor inicial si no existe valor en storage.
 * @param options.secret Secreto para encriptar/hashear.
 * @returns [valor, setter]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: { secret?: string }
): [T, (value: T | null) => void] {
  
  const getStorageKey = useCallback(() => {
    const secret = options?.secret || (process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === 'false' ? '' : process.env.NEXT_PUBLIC_STORAGE_SECRET!);
    return secret ? CryptoJS.SHA256(key + secret).toString() : key;
  }, [key, options?.secret]);

  // 1. El estado se inicializa SIEMPRE con `initialValue`. Esto es seguro para el servidor.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // 2. La lectura de localStorage ocurre solo en el cliente, después del montaje.
  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const secret = options?.secret || (process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === 'false' ? '' : process.env.NEXT_PUBLIC_STORAGE_SECRET!);
        const raw = secret
          ? CryptoJS.AES.decrypt(item, secret).toString(CryptoJS.enc.Utf8)
          : item;
        setStoredValue(JSON.parse(raw));
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // El array de dependencias vacío asegura que esto solo se ejecute una vez en el cliente.

  const setValue = (value: T | null) => {
    // Asegurarse de que solo se ejecuta en el cliente
    if (typeof window === 'undefined') {
      console.warn(`Attempted to set localStorage key “${key}” on the server.`);
      return;
    }

    try {
      const storageKey = getStorageKey();
      if (value === null) {
        window.localStorage.removeItem(storageKey);
        setStoredValue(initialValue);
      } else {
        const secret = options?.secret || (process.env.NEXT_PUBLIC_ENABLE_ENCRYPTION === 'false' ? '' : process.env.NEXT_PUBLIC_STORAGE_SECRET!);
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