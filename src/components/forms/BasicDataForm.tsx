import React, { useState, useEffect, Dispatch } from 'react';
import { BasicDataRepository } from '@/repos/basicData.repository';
import { InitialBasicDataType, PetStep as PetStep, type BasicDataType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';
import { Dates, Steps } from '@/utils/index';
import { petTypes, genders, weightUnits, breedOptions, foodOptions, weightConditionOptions, sizeOptions } from '@/data/petdata';
import { Empty } from '@/data/index';

interface BasicDataFormProps {
  petId: string;
  basicData: BasicDataType;
  setBasicData: (basicData: BasicDataType) => void;
  onNext: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function BasicDataForm({ petId, basicData, setBasicData, onNext, stepStates, setStepStates }: BasicDataFormProps) {
  const initials = (basicData: BasicDataType, fetch: boolean = false): InitialBasicDataType => {

    const initialPetType = petTypes.filter(t => t == basicData.pet_type).length > 0 || (basicData.pet_type == '' && !fetch) ? basicData.pet_type : 'Otro';
    const initialFood = foodOptions.find(t => t == basicData.main_food) != null || (basicData.main_food == '' && !fetch) ? basicData.main_food : 'Otro';
    const initialRace = (breedOptions[initialPetType] ?? []).filter(t => t == basicData.race).length > 0 || (basicData.race == '' && !fetch) ? basicData.race : 'Otro';
    const initialOtherPetType = initialPetType == 'Otro' ? basicData.pet_type : '';
    const initialOtherFood = initialFood == 'Otro' ? basicData.main_food : '';
    const initialOtherRace = initialRace == 'Otro' ? basicData.race : '';

    return {
      petType: initialPetType,
      food: initialFood,
      race: initialRace,
      otherPetType: initialOtherPetType,
      otherFood: initialOtherFood,
      otherRace: initialOtherRace
    };
  };

  const initial = initials(basicData);
  const [formData, setFormData] = useState<Partial<BasicDataType>>({ ...basicData, pet_id: petId, pet_type: initial.petType, main_food: initial.food, race: initial.race });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [weight, setWeight] = useState<number>(parseInt(basicData.weight.split(' ')[0]));
  const [weightUnit, setWeightUnit] = useState<string>(basicData.weight.split(' ')[1]);
  const [otherPetType, setOtherPetType] = useState<string>(initial.otherPetType);
  const [otherFood, setOtherFood] = useState<string>(initial.otherFood);
  const [otherRace, setOtherRace] = useState<string>(initial.otherRace);

  // Reset breed when pet type changes
  useEffect(() => {
    setFormData(fd => ({ ...fd, race: initial.race ? initial.race : '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.pet_type]);

  useEffect(() => {
    const fetch = async () => {
      if (JSON.stringify(basicData) == JSON.stringify(Empty.BasicData())) {
        const basicDataSaved = await BasicDataRepository.findByPetId(petId);
        if (basicDataSaved) {
          setBasicData(basicDataSaved);
          const initial = initials(basicDataSaved, true);
          setFormData({ ...basicDataSaved, pet_id: petId, pet_type: initial.petType, main_food: initial.food, race: initial.race });
          setWeight(parseInt(basicDataSaved.weight.split(' ')[0]));
          setWeightUnit(basicDataSaved.weight.split(' ')[1]);
          setOtherPetType(initial.otherPetType);
          setOtherRace(initial.race);
          setOtherFood(initial.food);
        }
      }
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const step = stepStates.find(x => x.number == PetStep.BasicData);
    try {
      if (step?.state != StepStateEnum.Saved) {
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
        setBasicData(dataToSave);
        Steps.ChangeState(stepStates, setStepStates, PetStep.BasicData, StepStateEnum.Saved);
      }
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Steps.ChangeState(stepStates, setStepStates, PetStep.BasicData, StepStateEnum.Error, err.message);
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
                  setOtherPetType(initial.petType);
                  setFormData({ ...formData, pet_type: 'Otro' });
                } else {
                  setOtherPetType(initial.petType);
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
                value={otherPetType}
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
                  setOtherRace(initial.otherRace);
                  setFormData({ ...formData, race: 'Otro' });
                } else {
                  setOtherRace(initial.otherRace);
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
                value={otherRace}
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
                  setOtherFood(initial.otherFood);
                  setFormData({ ...formData, main_food: 'Otro' });
                } else {
                  setOtherFood(initial.otherFood);
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
                value={otherFood}
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
                  value={formData.last_vaccine_date ? Dates.format(formData.last_vaccine_date) : ''}
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
                value={formData.castration_date ? Dates.format(formData.castration_date) : ''}
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
                value={formData.anti_flea_date ? Dates.format(formData.anti_flea_date) : ''}
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