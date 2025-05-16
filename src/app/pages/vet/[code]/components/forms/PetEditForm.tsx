"use client";
import { PetType } from "@/types/index";
import React, { useState, FormEvent } from "react";

interface Props {
  code: string;
  pet: PetType;
  disabled?: boolean;
}

export default function PetEditForm({ code, pet, disabled = false }: Props) {
  const [name, setName] = useState(pet.name);
  const [image, setImage] = useState(pet.image || "");
  const [alert, setAlert] = useState<string | null>(null);
  const [formFailed, setFormFailed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const res = await fetch(
      `${process.env.PROTOCOL}://${process.env.VERCEL_URL}/api/pets/${pet.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, image }),
      }
    );

    // ← usar res.ok para determinar éxito
    const success = res.ok;
    setFormFailed(!success);

    if (success) {
      setAlert("Datos actualizados correctamente.");
    } else {
      const json = await res.json();
      setAlert(json.error || "Error al actualizar.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 400, display: "grid", gap: "1rem" }}
    >
      <label>
        Nombre
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
          required
        />
      </label>

      <label>
        Imagen
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          disabled={disabled}
        />
      </label>

      <button type="submit" disabled={disabled}>
        Guardar cambios
      </button>

      {alert && (
        // ← solo basar color en formFailed
        <p style={{ color: formFailed ? "red" : "green" }}>{alert}</p>
      )}
    </form>
  );
}
