// components/pet-edit-form.tsx
"use client";

import React, { useState, FormEvent } from "react";

export interface Pet {
    id: string;
    name: string;
    species?: string;
    breed?: string;
    birth_date?: string;
}

interface Props {
    code: string;
    pet: Pet;
    disabled?: boolean;
}

export default function PetEditForm({ code, pet, disabled = false }: Props) {
    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species || "");
    const [breed, setBreed] = useState(pet.breed || "");
    const [birthDate, setBirthDate] = useState(pet.birth_date || "");
    const [alert, setAlert] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (disabled) return;

        const res = await fetch(`/api/pets/${pet.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code,
                name,
                species,
                breed,
                birth_date: birthDate,
            }),
        });
        const json = await res.json();

        if (res.ok) setAlert("Datos actualizados correctamente.");
        else setAlert(json.error || "Error al actualizar.");
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: "grid", gap: "1rem" }}>
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
                Especie
                <input
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    disabled={disabled}
                />
            </label>

            <label>
                Raza
                <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    disabled={disabled}
                />
            </label>

            <label>
                Fecha de nacimiento
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    disabled={disabled}
                />
            </label>

            <button type="submit" disabled={disabled}>
                Guardar cambios
            </button>

            {alert && (
                <p style={{ color: disabled ? "gray" : "green" }}>{alert}</p>
            )}
        </form>
    );
}
