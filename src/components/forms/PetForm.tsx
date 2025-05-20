// src/components/forms/BasicDataForm.tsx
import React, { useState } from 'react';
import { PetRepository } from '@/repos/pet.repository';
import { generateUniquePetId } from '@/utils/random';

interface PetFormProps {
  ownerId: string;
  petName: string;
  setPetName: (name: string) => void;
  petImage: string;
  setPetImage: (image: string) => void;
  setPetId: (petId: string | null) => void;
  onNext: () => void;
}

export default function PetForm({ ownerId, setPetId, onNext, petName, setPetName, petImage, setPetImage }: PetFormProps) {

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Paso 0: crear mascota
  const handleCreatePet = async () => {
    setError(null);
    setLoading(true);
    try {
      const newId = await generateUniquePetId();
      const { error: petErr } = await PetRepository.create({
        id: newId,
        name: petName,
        image: petImage,
        owner_id: ownerId,
      });
      if (petErr) throw new Error(petErr?.message || "Error creando mascota");
      setPetId(newId);
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4" style={{ display: 'flow' }}>
      <label>
        Nombre
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          required
        />
      </label>
      <label>
        URL de imagen
        <input
          type="text"
          value={petImage}
          onChange={(e) => setPetImage(e.target.value)}
        />
      </label>
      {error && <p className="text-error">{error}</p>}
      <button
        type="button"
        onClick={handleCreatePet}
        disabled={loading}
        className="btn-primary"
      >
        {loading ? "Creando…" : "Siguiente"}
      </button>
    </div>
  );
}
