// src/components/forms/consultation/sections/OwnerPetSection.tsx
import React from 'react';
import type { OwnerDataType, PetType } from '@/types/index';

interface OwnerPetSectionProps {
    owner: OwnerDataType | null;
    pet: PetType;
    // basicPetData?: BasicDataType; // Podrías pasar BasicDataType si ya la tienes cargada
}

export function OwnerPetSection({ owner, pet /*, basicPetData */ }: OwnerPetSectionProps) {
    // Idealmente, los datos de 'Especie', 'Sexo', 'Fecha de nacimiento', 'Peso (gr.)', 'Chip #'
    // vendrían de `BasicDataType` de la mascota.
    // Aquí simulamos algunos o los dejamos como placeholder.
    // En una implementación real, cargarías `BasicDataType` junto con `PetType`.

    return (
        <>
            <fieldset>
                <legend>2. Datos del Propietario</legend>
                <div className="grid">
                    <label>
                        Nombre Propietario
                        <input type="text" value={`${owner?.name || ''} ${owner?.last_name || ''}`} readOnly disabled />
                    </label>
                    <label>
                        Teléfono Celular
                        <input type="text" value={owner?.phone || ''} readOnly disabled />
                    </label>
                </div>
                <label>
                    Correo Electrónico
                    <input type="text" value={owner?.email || ''} readOnly disabled />
                </label>
                {/* Puedes añadir más campos del propietario si son relevantes y están disponibles */}
            </fieldset>

            <fieldset>
                <legend>3. Reseña de la Mascota</legend>
                <div className="grid">
                    <label>
                        Nombre Paciente
                        <input type="text" value={pet.name} readOnly disabled />
                    </label>
                    <label>
                        Especie
                        {/* <input type="text" value={basicPetData?.pet_type || 'N/A'} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                </div>
                <div className="grid">
                    <label>
                        Raza
                        {/* <input type="text" value={basicPetData?.race || 'N/A'} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                    <label>
                        Sexo
                        {/* <input type="text" value={basicPetData?.gender || 'N/A'} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                </div>
                <div className="grid">
                    <label>
                        Fecha de Nacimiento
                        {/* <input type="date" value={basicPetData?.birth_date ? Dates.format(basicPetData.birth_date) : ''} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                    <label>
                        Peso (gr.)
                        {/* <input type="text" value={basicPetData?.weight || 'N/A'} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                </div>
                <div className="grid">
                    <label>
                        Color y Tipo de Pelaje
                        <input type="text" name="coat_description" placeholder="Describir color y pelaje" readOnly disabled />
                    </label>
                    <label>
                        Chip #
                        {/* <input type="text" value={basicPetData?.chip_number || 'N/A'} readOnly disabled /> */}
                        <input type="text" value={'N/A'} readOnly disabled />
                    </label>
                </div>
                {/* Añade más campos de la reseña según sea necesario */}
            </fieldset>
        </>
    );
}