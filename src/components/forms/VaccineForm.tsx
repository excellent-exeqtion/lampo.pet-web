// src/components/forms/VaccineForm.tsx
"use client";

import React, { useState } from "react";
import { VaccineRepository } from "@/repos/vaccine.repository";
import type { VaccineDataType } from "@/types/index";

interface VaccineFormProps {
  petId: string;
  onNext: () => void;
}

const emptyVaccine = (petId: string): Partial<VaccineDataType> => ({
  pet_id: petId,
  name: "",
  description: "",
  date: undefined,
  batch: "",
  brand: "",
});

export default function VaccineForm({ petId, onNext }: VaccineFormProps) {
  const [vaccines, setVaccines] = useState<Partial<VaccineDataType>[]>([
    emptyVaccine(petId),
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Añade una nueva fila
  const handleAdd = () => {
    setVaccines((prev) => [...prev, emptyVaccine(petId)]);
  };

  // Actualiza un campo de la vacuna en la posición i
  const handleChange = (
    i: number,
    field: keyof VaccineDataType,
    value: string | Date | undefined
  ) => {
    const updated = vaccines.map((v, idx) =>
      idx === i ? { ...v, [field]: value } : v
    );
    setVaccines(updated);
  };

  // Envia todas las vacunas
  const handleSubmit = async () => {
    setError(null);
    // Validación: todas deben tener name, batch y brand
    for (let i = 0; i < vaccines.length; i++) {
      const v = vaccines[i];
      if (!v.name || !v.batch || !v.brand) {
        setError(`La vacuna #${i + 1} requiere nombre, lote y marca.`);
        return;
      }
    }

    setLoading(true);
    try {
      // Enviar en paralelo o en secuencia según repositorio
      await Promise.all(
        vaccines.map((v) =>
          VaccineRepository.create(v as VaccineDataType)
        )
      );
      onNext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Error al guardar vacunas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6" style={{display:'flow'}}>
      {vaccines.map((vaccine, i) => (
        <fieldset
          key={i}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded"
          style={{display: 'flex'}}
        >
          <legend className="text-lg font-semibold">
            Vacuna #{i + 1}
          </legend>

          <label>
            Nombre *
            <input
              type="text"
              value={vaccine.name}
              onChange={(e) =>
                handleChange(i, "name", e.target.value)
              }
              required
              className="w-full"
            />
          </label>

          <label>
            Descripción
            <input
              type="text"
              value={vaccine.description || ""}
              onChange={(e) =>
                handleChange(i, "description", e.target.value)
              }
              className="w-full"
            />
          </label>

          <label>
            Fecha
            <input
              type="date"
              value={
                vaccine.date
                  ? (vaccine.date as Date)
                      .toISOString()
                      .substr(0, 10)
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  i,
                  "date",
                  e.target.valueAsDate || undefined
                )
              }
              className="w-full"
            />
          </label>

          <label>
            Lote *
            <input
              type="text"
              value={vaccine.batch}
              onChange={(e) =>
                handleChange(i, "batch", e.target.value)
              }
              required
              className="w-full"
            />
          </label>

          <label>
            Marca *
            <input
              type="text"
              value={vaccine.brand}
              onChange={(e) =>
                handleChange(i, "brand", e.target.value)
              }
              required
              className="w-full"
            />
          </label>
        </fieldset>
      ))}

      {error && (
        <p className="text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleAdd}
          className="contrast"
          disabled={loading}
        >
          Agregar otra vacuna
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          className="contrast"
          disabled={loading}
        >
          {loading ? "Guardando…" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
