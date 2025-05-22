// src/utils/validations.ts

import { FieldConfig } from "@/types/lib";

/**
 * Valida un array de entidades genericas contra su configuracion de campos.
 * Devuelve null si todo pasa, o un mensaje con los campos obligatorios faltantes.
 */
export function forFields<T>(
  items: Partial<T>[],
  entityName: string,
  fieldsConfig: FieldConfig<T>[]
): string | null {
  const missing: string[] = [];

  items.forEach((item, idx) => {
    fieldsConfig
      .filter(field => field.mandatory)
      .forEach(field => {
        if (!item[field.name]) {
          missing.push(`${field.label} en ${entityName} #${idx + 1}`);
        }
      });
  });

  if (missing.length > 0) {
    return `Faltan los campos obligatorios: ${missing.join(', ')}`;
  }
  return null;
}
