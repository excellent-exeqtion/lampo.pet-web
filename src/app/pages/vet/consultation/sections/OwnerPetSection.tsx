// src/components/forms/consultation/sections/OwnerPetSection.tsx
import React, { useState, useEffect } from 'react';
import type { OwnerDataType, PetType, BasicDataType } from '@/types/index';
import { Dates } from '@/utils/index';

interface OwnerPetSectionProps {
    owner: OwnerDataType | null;
    pet: PetType;
    basicPetData: BasicDataType | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onBasicDataChange: (field: keyof BasicDataType, value: any) => void;
}

export function OwnerPetSection({ owner, pet, basicPetData, onBasicDataChange }: OwnerPetSectionProps) {
    const [currentWeight, setCurrentWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('Kg');

    useEffect(() => {
        if (basicPetData?.weight) {
            const [value, unit] = basicPetData.weight.split(' ');
            setCurrentWeight(value || '');
            setWeightUnit(unit || 'Kg');
        }
    }, [basicPetData]);

    const handleWeightChange = () => {
        onBasicDataChange('weight', `${currentWeight} ${weightUnit}`);
    };

    return (
        <>
            <fieldset>
                <legend>2. Datos del Propietario</legend>
                <div className="grid">
                    <label>Nombre Propietario<input type="text" value={`${owner?.name || ''} ${owner?.last_name || ''}`} readOnly disabled /></label>
                    <label>Teléfono Celular<input type="text" value={owner?.phone || ''} readOnly disabled /></label>
                </div>
                <label>Correo Electrónico<input type="text" value={owner?.email || ''} readOnly disabled /></label>
            </fieldset>

            <fieldset>
                <legend>3. Reseña de la Mascota</legend>
                <div className="grid">
                    <label>Nombre Paciente<input type="text" value={pet.name} readOnly disabled /></label>
                    <label>Especie<input type="text" value={basicPetData?.pet_type || 'N/A'} readOnly disabled /></label>
                </div>
                <div className="grid">
                    <label>Raza<input type="text" value={basicPetData?.race || 'N/A'} readOnly disabled /></label>
                    <label>Sexo<input type="text" value={basicPetData?.gender || 'N/A'} readOnly disabled /></label>
                </div>
                <div className="grid">
                    <label>Fecha de Nacimiento<input type="date" value={Dates.format(pet.birth_date)} readOnly disabled /></label>
                    <label>
                        Peso Actual
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="number"
                                value={currentWeight}
                                onChange={(e) => setCurrentWeight(e.target.value)}
                                onBlur={handleWeightChange} // Actualiza al perder el foco
                                placeholder="Ej: 5.5"
                                style={{ flex: 2 }}
                            />
                            <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} onBlur={handleWeightChange} style={{ flex: 1 }}>
                                <option value="Kg">Kg</option>
                                <option value="Lb">Lb</option>
                            </select>
                        </div>
                    </label>
                </div>
                <div className="grid">
                    <label>Color y Tipo de Pelaje<input type="text" value={ basicPetData ? `${basicPetData?.color} ${basicPetData?.coat_type}` : 'N/A'} readOnly disabled /></label>
                    <label>Chip #<input type="text" value={'N/A'} readOnly /></label>
                </div>
            </fieldset>
        </>
    );
}