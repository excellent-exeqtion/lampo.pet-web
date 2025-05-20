import React, { useState, useEffect } from 'react';
import { BasicDataRepository } from '@/repos/basicData.repository';
import type { BasicDataType } from '@/types/index';

interface BasicDataFormProps {
  petId: string;
  onNext: () => void;
}

const petTypes = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'];
const genders = ['Macho', 'Hembra'];
const weightUnits = ['Kg', 'Lb'];
const breedOptions: Record<string, string[]> = {
  Perro: ['Labrador', 'Pastor Alemán', 'Bulldog', 'Otro'],
  Gato: ['Siamés', 'Persa', 'Maine Coon', 'Otro'],
  Ave: ['Loro', 'Canario', 'Periquito', 'Otro'],
  Reptil: ['Iguana', 'Tortuga', 'Otro'],
  Otro: ['Otro'],
};
const foodOptions = [
  'Royal Canin',
  'Purina Pro Plan',
  'Whiskas',
  'Dog Chow',
  'Eukanuba',
  'Nutra Nuggets',
  'Pedigree',
  'Otro'
];
const weightConditionOptions = ['Bajo peso', 'Peso ideal', 'Sobrepeso'];
const sizeOptions = ['Pequeño', 'Mediano', 'Grande', 'Extra Grande'];

export default function BasicDataForm({ petId, onNext }: BasicDataFormProps) {
  const [formData, setFormData] = useState<Partial<BasicDataType>>({
    pet_id: petId,
    pet_type: '',
    gender: '',
    weight: '',
    race: '',
    has_allergies: false,
    weight_condition: '',
    size: '',
    lives_with_others: false,
    main_food: '',
    has_vaccine: false,
    last_vaccine_name: '',
    last_vaccine_date: undefined,
    is_castrated: false,
    castration_date: undefined,
    has_anti_flea: false,
    anti_flea_date: undefined,
    uses_medicine: false,
    special_condition: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<string>("Kg");
  const [otherFood, setOtherFood] = useState<string>('');
  const [otherPetType, setOtherPetType] = useState<string>('');
  const [otherRace, setOtherRace] = useState<string>('');

  // Reset breed when pet type changes
  useEffect(() => {
    setFormData(fd => ({ ...fd, race: '' }));
  }, [formData.pet_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const finalFood = formData.main_food === 'Otro' ? otherFood.trim() : formData.main_food;
      const finalPetType = formData.pet_type === 'Otro' ? otherPetType.trim() : formData.pet_type;
      const finalRace = formData.race === 'Otro' ? otherRace.trim() : formData.race;
      const finalWeigth = `${weight} ${weightUnit}`;
      const dataToSave: BasicDataType = {
        ...(formData as BasicDataType),
        main_food: finalFood || '',
        weight: finalWeigth || '',
        pet_type: finalPetType || '',
        race: finalRace || '',
      };
      await BasicDataRepository.create(dataToSave);
      await BasicDataRepository.create(formData as BasicDataType);
      onNext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Sección: Información básica */}
      <fieldset>
        <legend>Información básica</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pet_type">Tipo de mascota</label>
            <select
              id="pet_type"
              className="w-full"
              value={formData.pet_type}
              onChange={e => {
                const val = e.target.value;
                if (val === 'Otro') {
                  setOtherPetType('');
                  setFormData({ ...formData, pet_type: 'Otro' });
                } else {
                  setOtherPetType('');
                  setFormData({ ...formData, pet_type: val });
                }
              }}
              required
            >
              <option value="" disabled>Selecciona tipo</option>
              {petTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            {formData.pet_type === 'Otro' && (
              <input
                type="text"
                placeholder="Especifica el tipo"
                className="w-full mt-2"
                onChange={e => setOtherPetType(e.target.value)}
              />
            )}
          </div>
          <div>
            <label htmlFor="gender">Género</label>
            <select
              id="gender"
              className="w-full"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
              required
            >
              <option value="" disabled>Selecciona género</option>
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="weight">Peso</label>
            <div className="flex gap-2">
              <input
                id="weight"
                type="number"
                min="0"
                className="w-2/3"
                value={weight}
                onChange={e => setWeight(parseInt(e.target.value))}
                required
              />
              <select
                id="weight_unit"
                className="w-1/3"
                value={weightUnit}
                onChange={e => setWeightUnit(e.target.value)}
              >
                {weightUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="race">Raza</label>
            <select
              id="race"
              className="w-full"
              value={formData.race}
              onChange={e => {
                const val = e.target.value;
                if (val === 'Otro') {
                  setOtherPetType('');
                  setFormData({ ...formData, race: 'Otro' });
                } else {
                  setOtherPetType('');
                  setFormData({ ...formData, race: val });
                }
              }}
              required
              disabled={!formData.pet_type}
            >
              <option value="" disabled>{formData.pet_type ? 'Selecciona raza' : 'Selecciona primero tipo'}</option>
              {formData.pet_type && breedOptions[formData.pet_type].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {formData.race === 'Otro' && (
              <input
                type="text"
                placeholder="Especifica la raza"
                className="w-full mt-2"
                onChange={e => setOtherRace(e.target.value)}
              />
            )}
          </div>
        </div>
      </fieldset>

      {/* Sección: Alimentación y entorno */}
      <fieldset>
        <legend>Alimentación y entorno</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="main_food">Comida principal</label>
            <select
              id="main_food"
              className="w-full"
              value={formData.main_food}
              onChange={e => {
                const val = e.target.value;
                if (val === 'Otro') {
                  setOtherFood('');
                  setFormData({ ...formData, main_food: 'Otro' });
                } else {
                  setOtherFood('');
                  setFormData({ ...formData, main_food: val });
                }
              }}
              required
            >
              <option value="" disabled>Selecciona comida</option>
              {foodOptions.map(food => <option key={food} value={food}>{food}</option>)}
              <option value="Otro">Otro</option>
            </select>
            {formData.main_food === 'Otro' && (
              <input
                type="text"
                placeholder="Especifica la comida"
                className="w-full mt-2"
                onChange={e => setOtherFood(e.target.value)}
              />
            )}
          </div>
          <div>
            <label htmlFor="weight_condition">Condición de peso</label>
            <select
              id="weight_condition"
              className="w-full"
              value={formData.weight_condition}
              onChange={e => setFormData({ ...formData, weight_condition: e.target.value })}
            >
              <option value="" disabled>Selecciona condición</option>
              {weightConditionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="size">Tamaño</label>
            <select
              id="size"
              className="w-full"
              value={formData.size}
              onChange={e => setFormData({ ...formData, size: e.target.value })}
            >
              <option value="" disabled>Selecciona tamaño</option>
              {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2" htmlFor="lives_with_others">
              <input
                id="lives_with_others"
                type="checkbox"
                checked={formData.lives_with_others}
                onChange={e => setFormData({ ...formData, lives_with_others: e.target.checked })}
              />
              Vive con otros
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2" htmlFor="has_allergies">
              <input
                id="has_allergies"
                type="checkbox"
                checked={formData.has_allergies}
                onChange={e => setFormData({ ...formData, has_allergies: e.target.checked })}
              />
              Alergias
            </label>
          </div>
        </div>
      </fieldset>

      {/* Sección: Vacunación */}
      <fieldset>
        <legend>Vacunación</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2" htmlFor="has_vaccine">
            <input
              id="has_vaccine"
              type="checkbox"
              checked={formData.has_vaccine}
              onChange={e => setFormData({ ...formData, has_vaccine: e.target.checked })}
            />
            Tiene vacunas
          </label>
          {formData.has_vaccine && (
            <>
              <div>
                <label htmlFor="last_vaccine_name">Nombre última vacuna</label>
                <input
                  id="last_vaccine_name"
                  type="text"
                  className="w-full"
                  value={formData.last_vaccine_name}
                  onChange={e => setFormData({ ...formData, last_vaccine_name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="last_vaccine_date">Fecha última vacuna</label>
                <input
                  id="last_vaccine_date"
                  type="date"
                  className="w-full"
                  value={formData.last_vaccine_date ? formData.last_vaccine_date.toISOString().slice(0, 10) : ''}
                  onChange={e => setFormData({ ...formData, last_vaccine_date: e.target.valueAsDate || undefined })}
                />
              </div>
            </>
          )}
        </div>
      </fieldset>

      {/* Sección: Procedimientos */}
      <fieldset>
        <legend>Procedimientos</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2" htmlFor="is_castrated">
            <input
              id="is_castrated"
              type="checkbox"
              checked={formData.is_castrated}
              onChange={e => setFormData({ ...formData, is_castrated: e.target.checked })}
            />
            Castrado
          </label>
          {formData.is_castrated && (
            <div>
              <label htmlFor="castration_date">Fecha de castración</label>
              <input
                id="castration_date"
                type="date"
                className="w-full"
                value={formData.castration_date ? formData.castration_date.toISOString().slice(0, 10) : ''}
                onChange={e => setFormData({ ...formData, castration_date: e.target.valueAsDate || undefined })}
              />
            </div>
          )}
          <label className="flex items-center gap-2" htmlFor="has_anti_flea">
            <input
              id="has_anti_flea"
              type="checkbox"
              checked={formData.has_anti_flea}
              onChange={e => setFormData({ ...formData, has_anti_flea: e.target.checked })}
            />
            Antipulgas
          </label>
          {formData.has_anti_flea && (
            <div>
              <label htmlFor="anti_flea_date">Fecha antipulgas</label>
              <input
                id="anti_flea_date"
                type="date"
                className="w-full"
                value={formData.anti_flea_date ? formData.anti_flea_date.toISOString().slice(0, 10) : ''}
                onChange={e => setFormData({ ...formData, anti_flea_date: e.target.valueAsDate || undefined })}
              />
            </div>
          )}
        </div>
      </fieldset>

      {/* Sección: Otros datos */}
      <fieldset>
        <legend>Otros datos</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center gap-2" htmlFor="uses_medicine">
            <input
              id="uses_medicine"
              type="checkbox"
              checked={formData.uses_medicine}
              onChange={e => setFormData({ ...formData, uses_medicine: e.target.checked })}
            />
            Usa medicina
          </label>
          <label className="flex items-center gap-2" htmlFor="special_condition">
            <input
              id="special_condition"
              type="checkbox"
              checked={formData.special_condition}
              onChange={e => setFormData({ ...formData, special_condition: e.target.checked })}
            />
            Condición especial
          </label>
        </div>
      </fieldset>

      {error && <p className="text-error mt-4">{error}</p>}
      <button type="submit" className="contrast" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Guardando…' : 'Siguiente'}
      </button>
    </form>
  );
}