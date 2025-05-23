// src/components/forms/BasicDataForm.tsx
import React, { useState, useEffect, Dispatch } from 'react';
import { BasicDataRepository } from '@/repos/basicData.repository';
import { InitialBasicDataType, PetStep as PetStep, type BasicDataType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';
import { Dates, Step } from '@/utils/index';
import { petTypes, genders, weightUnits, breedOptions, foodOptions, weightConditionOptions, sizeOptions } from '@/data/petdata';
import Steps from "../lib/steps";
import { Empty } from '@/data/index';
import { useDeviceDetect } from '@/hooks/useDeviceDetect';

interface BasicDataFormProps {
  petId: string;
  basicData: BasicDataType;
  setBasicData: (basicData: BasicDataType) => void;
  onBack: () => void;
  onNext: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function BasicDataForm({ petId, basicData, setBasicData, onNext, onBack, stepStates, setStepStates }: BasicDataFormProps) {
  const step = PetStep.BasicData;
  const setState = (stepState: StepStateEnum, stepError: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, stepState, stepError);
  }
  const stateEq = (stepState: StepStateEnum) => {
    return stepStates.find(x => x.number == step)?.state == stepState;
  }
  const initials = (basicData: BasicDataType, fetch: boolean = false): InitialBasicDataType => {
    const initialPetType = petTypes.filter(t => t == basicData.pet_type).length > 0 || (basicData.pet_type == '' && !fetch) ? basicData.pet_type : 'Otro';
    const initialFood = foodOptions.find(t => t == basicData.main_food) != null || (basicData.main_food == '' && !fetch) ? basicData.main_food : 'Otro';
    const initialRace = (breedOptions[initialPetType] ?? []).filter(t => t == basicData.race).length > 0 || (basicData.race == '' && !fetch) ? basicData.race : 'Otro';
    const initialOtherPetType = initialPetType != 'Otro' && basicData.pet_type == 'Otro' ? '' : basicData.pet_type;
    const initialOtherFood = initialFood != 'Otro' && basicData.main_food == 'Otro' ? '' : basicData.main_food;
    const initialOtherRace = initialRace != 'Otro' && basicData.race == 'Otro' ? '' : basicData.race;
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
  console.log(basicData)
  const [formData, setFormData] = useState<Partial<BasicDataType>>({ ...basicData, pet_id: petId, pet_type: initial.petType, main_food: initial.food, race: initial.race });
  const [error, setError] = useState<string | null>(null);
  const [loadLoading, setLoadLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [weight, setWeight] = useState<number>(parseFloat(basicData.weight.split(' ')[0]) ?? 0);
  const [weightUnit, setWeightUnit] = useState<string>(basicData.weight.split(' ')[1]);
  const [otherPetType, setOtherPetType] = useState<string>(initial.otherPetType);
  const [otherFood, setOtherFood] = useState<string>(initial.otherFood);
  const [otherRace, setOtherRace] = useState<string>(initial.otherRace);
  const [loadedWithApi, setLoadedWithApi] = useState<boolean>(false);
  const [savedData, setSavedData] = useState<BasicDataType>(Empty.BasicData());
  const { isMobile, isDesktop, isTablet } = useDeviceDetect();

  // Estilo común de grid: en móvil siempre 2 columnas, en desktop auto-ajusta
  const sectionGridStyle: React.CSSProperties = {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: isMobile
      ? "repeat(2, 1fr)"
      : "repeat(4, 1fr)"
  };
  // Estilo común de grid: en móvil siempre 2 columnas, en desktop auto-ajusta
  const tabletSectionGridStyle: React.CSSProperties = {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(2, 1fr)"
  };



  useEffect(() => {
    if (JSON.stringify(savedData) != JSON.stringify(formData) && !stateEq(StepStateEnum.NotInitialize) && loadLoading == false) {
      setState(StepStateEnum.Modified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, otherPetType, otherFood, otherRace, weight, weightUnit]);

  useEffect(() => {
    const fetch = async () => {
      setLoadLoading(true);
      if (stateEq(StepStateEnum.NotInitialize)) {
        const basicDataSaved = await BasicDataRepository.findByPetId(petId);
        if (basicDataSaved) {
          setSavedData(basicDataSaved);
          setBasicData(basicDataSaved);
          const initial = initials(basicDataSaved, loadedWithApi);
          setLoadedWithApi(true);
          setFormData({ ...basicDataSaved, pet_id: petId, pet_type: initial.petType, main_food: initial.food, race: initial.race });
          setWeight(parseFloat(basicDataSaved.weight.split(' ')[0]));
          setWeightUnit(basicDataSaved.weight.split(' ')[1]);
          setOtherPetType(initial.otherPetType);
          setOtherRace(initial.otherRace);
          setOtherFood(initial.otherFood);
        }
        setState(StepStateEnum.Initialize);
      }
      setLoadLoading(false);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId, formData]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitLoading(false);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const finalFood = formData.main_food === 'Otro' ? otherFood.trim() : formData.main_food;
        const finalPetType = formData.pet_type === 'Otro' ? otherPetType.trim() : formData.pet_type;
        const finalRace = formData.race === 'Otro' ? otherRace.trim() : formData.race;
        const finalWeight = `${weight ?? 0} ${weightUnit}`;
        const dataToSave: BasicDataType = {
          ...(formData as BasicDataType),
          main_food: finalFood || '',
          weight: finalWeight || '0 Kg',
          pet_type: finalPetType || '',
          race: finalRace || '',
        };
        const { error: basicDataErr } = await BasicDataRepository.create(dataToSave);
        if (basicDataErr) throw new Error(basicDataErr?.message || "Error creando mascota");
        setSavedData(dataToSave);
        setBasicData(dataToSave);
        setState(StepStateEnum.Saved);
      }
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setState(StepStateEnum.Error, err.message);
      setError(err.message);
    } finally {
      setSubmitLoading(true);
    }
  };

  return (
    <Steps onBack={onBack} onNext={handleSubmit} submitLoading={submitLoading} loadLoading={loadLoading} step={step} totalSteps={stepStates.length} error={error}>
      {/* Sección: Información básica */}
      <fieldset>
        <legend><b>Información básica</b></legend>
        <div style={sectionGridStyle}>
          <div>
            <label htmlFor="pet_type">Tipo de mascota</label>
            <select
              id="pet_type"
              className="w-full"
              value={formData.pet_type}
              disabled={loadLoading}
              onChange={e => {
                const val = e.target.value;
                if (val === 'Otro') {
                  setOtherPetType(initial.petType);
                  setFormData({ ...formData, pet_type: 'Otro', race: '' });
                } else {
                  setOtherPetType(initial.petType);
                  setFormData({ ...formData, pet_type: val, race: '' });
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
                disabled={loadLoading}
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
              disabled={loadLoading}
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
                pattern="^\d+(?:\.\d{1,2})?$"
                min="0"
                className="w-2/3"
                disabled={loadLoading}
                value={weight ?? 0}
                onChange={e => setWeight(parseFloat(e.target.value) ?? 0)}
                required
              />
              <select
                id="weight_unit"
                className="w-1/3"
                value={weightUnit}
                disabled={loadLoading}
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
              disabled={loadLoading || !formData.pet_type}
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
            >
              <option value="" disabled>{formData.pet_type ? 'Selecciona raza' : 'Selecciona primero tipo'}</option>
              {formData.pet_type && breedOptions[formData.pet_type].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            {formData.race === 'Otro' && (
              <input
                value={otherRace}
                disabled={loadLoading}
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
        <legend><b>Alimentación y entorno</b></legend>
        <div style={sectionGridStyle}>
          <div>
            <label htmlFor="main_food">Comida principal</label>
            <select
              id="main_food"
              className="w-full"
              value={formData.main_food}
              disabled={loadLoading}
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
            </select>
            {formData.main_food === 'Otro' && (
              <input
                value={otherFood}
                disabled={loadLoading}
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
              disabled={loadLoading}
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
              disabled={loadLoading}
              onChange={e => setFormData({ ...formData, size: e.target.value })}
            >
              <option value="" disabled>Selecciona tamaño</option>
              {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div style={sectionGridStyle}>
          <div>
            <label className="flex items-center gap-2" htmlFor="lives_with_others">
              <input
                id="lives_with_others"
                type="checkbox"
                checked={formData.lives_with_others}
                disabled={loadLoading}
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
                disabled={loadLoading}
                onChange={e => setFormData({ ...formData, has_allergies: e.target.checked })}
              />
              Alergias
            </label>
          </div>
        </div>
      </fieldset>

      {/* Sección: Vacunación y procedimientos */}
      <fieldset>
        <legend><b>Vacunación y procedimientos</b></legend>
        <div style={isTablet ? tabletSectionGridStyle : sectionGridStyle}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="flex items-center gap-2" htmlFor="has_vaccine">
              <input
                id="has_vaccine"
                type="checkbox"
                checked={formData.has_vaccine}
                disabled={loadLoading}
                onChange={e => setFormData({ ...formData, has_vaccine: e.target.checked })}
              />
              Tiene vacunas
            </label>
          </div>
          {isDesktop &&
            <>
              <div>
                <label className="flex items-center gap-2" htmlFor="is_castrated">
                  <input
                    id="is_castrated"
                    type="checkbox"
                    checked={formData.is_castrated}
                    onChange={e => setFormData({ ...formData, is_castrated: e.target.checked })}
                    disabled={loadLoading}
                  />
                  Castrado
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2" htmlFor="has_anti_flea">
                  <input
                    id="has_anti_flea"
                    type="checkbox"
                    checked={formData.has_anti_flea}
                    disabled={loadLoading}
                    onChange={e => setFormData({ ...formData, has_anti_flea: e.target.checked })}
                  />
                  Antipulgas
                </label>
              </div>
            </>
          }
        </div>
        <div style={isTablet ? tabletSectionGridStyle : sectionGridStyle}>
          {formData.has_vaccine && (
            <>
              <div>
                <label htmlFor="last_vaccine_name">Nombre última vacuna</label>
                <input
                  id="last_vaccine_name"
                  type="text"
                  className="w-full"
                  value={formData.last_vaccine_name}
                  disabled={loadLoading}
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
                  disabled={loadLoading}
                  onChange={e => setFormData({ ...formData, last_vaccine_date: e.target.valueAsDate || undefined })}
                />
              </div>
            </>
          )}
          {!formData.has_vaccine &&
            <>
              <div style={{ gridColumn: 'span 2' }}></div>
            </>}
          {!isDesktop &&
            <>
              <div>
                <label className="flex items-center gap-2" htmlFor="is_castrated">
                  <input
                    id="is_castrated"
                    type="checkbox"
                    checked={formData.is_castrated}
                    onChange={e => setFormData({ ...formData, is_castrated: e.target.checked })}
                    disabled={loadLoading}
                  />
                  Castrado
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2" htmlFor="has_anti_flea">
                  <input
                    id="has_anti_flea"
                    type="checkbox"
                    checked={formData.has_anti_flea}
                    disabled={loadLoading}
                    onChange={e => setFormData({ ...formData, has_anti_flea: e.target.checked })}
                  />
                  Antipulgas
                </label>
              </div>
            </>
          }
          <div>
            {formData.is_castrated && (
              <div>
                <label htmlFor="castration_date">Fecha de castración</label>
                <input
                  id="castration_date"
                  type="date"
                  className="w-full"
                  value={formData.castration_date ? Dates.format(formData.castration_date) : ''}
                  onChange={e => setFormData({ ...formData, castration_date: e.target.valueAsDate || undefined })}
                  disabled={loadLoading}
                />
              </div>
            )}
          </div>
          <div>
            {formData.has_anti_flea && (
              <div>
                <label htmlFor="anti_flea_date">Fecha antipulgas</label>
                <input
                  id="anti_flea_date"
                  type="date"
                  className="w-full"
                  value={formData.anti_flea_date ? Dates.format(formData.anti_flea_date) : ''}
                  disabled={loadLoading}
                  onChange={e => setFormData({ ...formData, anti_flea_date: e.target.valueAsDate || undefined })}
                />
              </div>
            )}
          </div>
        </div>
      </fieldset>

      {/* Sección: Otros datos */}
      <fieldset>
        <legend><b>Otros datos</b></legend>
        <div style={sectionGridStyle}>
          <label className="flex items-center gap-2" htmlFor="uses_medicine">
            <input
              id="uses_medicine"
              type="checkbox"
              checked={formData.uses_medicine}
              disabled={loadLoading}
              onChange={e => setFormData({ ...formData, uses_medicine: e.target.checked })}
            />
            Usa medicina
          </label>
          <label className="flex items-center gap-2" htmlFor="special_condition">
            <input
              id="special_condition"
              type="checkbox"
              checked={formData.special_condition}
              disabled={loadLoading}
              onChange={e => setFormData({ ...formData, special_condition: e.target.checked })}
            />
            Condición especial
          </label>
        </div>
      </fieldset>
    </Steps>
  );
}