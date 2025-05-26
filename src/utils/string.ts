import { ApiParams } from "@/types/lib";

export function titleCase(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

/**
 * Convierte un objeto en un query string para URL.
 * Omite claves con valor undefined o null.
 *
 * @example
 * paramsToString({ a: 1, b: 'hola mundo', c: undefined }) 
 * // devuelve "?a=1&b=hola%20mundo"
 *
 * @param params Objeto cuyas claves/valores se desean serializar.
 * @returns Query string (incluye '?' si hay al menos un parámetro).
 */
export function fromParams(params: ApiParams): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // Si es array, repetimos key=valor por cada elemento
      if (Array.isArray(value)) {
        return value
          .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  if (entries.length === 0) {
    return '';
  }
  return `?${entries.join('&')}`;
}