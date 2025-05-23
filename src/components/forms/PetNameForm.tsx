// src/components/forms/BasicDataForm.tsx
import React, { Dispatch, useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { PetRepository } from '@/repos/pet.repository';
import { generateUniquePetId } from '@/utils/random';
import { PetStep, PetType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';
import Steps from '../lib/steps';
import { Step } from '@/utils/index';
import { Empty } from '@/data/index';
import { CircularImage } from "@/components/index";
import { useAppContext } from '@/app/layout';

interface PetFormProps {
  ownerId: string;
  pet: PetType;
  setPet: (pet: PetType) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function PetNameForm({
  ownerId,
  pet,
  setPet,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: PetFormProps) {
  const step = PetStep.Name;
  const setState = (stepState: StepStateEnum, stepError: string | null = null) => {
    Step.ChangeState(stepStates, setStepStates, step, stepState, stepError);
  };
  const stateEq = (stepState: StepStateEnum) =>
    stepStates.find((x) => x.number === step)?.state === stepState;

  const [error, setError] = useState<string | null>(null);
  const [loadLoading, setLoadLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [savedData, setSavedData] = useState<PetType>(Empty.Pet());
  const [preview, setPreview] = useState<string>(pet.image || '/pets/pet.png');
  const { setStoredPet, setStoredOwnerPets } = useAppContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPet({ ...pet, image: base64 });
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  }, [pet, setPet]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (stateEq(StepStateEnum.NotInitialize) && !pet.id) {
        setState(StepStateEnum.Initialize);
      } else if (stateEq(StepStateEnum.NotInitialize)) {
        const petSaved = await PetRepository.findById(pet.id);
        if (petSaved) {
          setPet(petSaved);
          setStoredPet(petSaved);
          setStoredOwnerPets([]);
          setSavedData(petSaved);
          setPreview(petSaved.image || preview);
        }
        setState(StepStateEnum.Initialize);
      }
      setLoadLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  useEffect(() => {
    if (
      JSON.stringify(savedData) !== JSON.stringify(pet) &&
      !stateEq(StepStateEnum.NotInitialize)
    ) {
      setState(StepStateEnum.Modified);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  const handleSubmit = async () => {
    setError(null);
    setSubmitLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const newId = pet.id || (await generateUniquePetId());
        const newPet: PetType = { id: newId, name: pet.name, image: pet.image, owner_id: ownerId };
        const { error: petErr } = await PetRepository.create(newPet);
        if (petErr) throw new Error(petErr.message);
        setSavedData(newPet);
        setStoredPet(newPet);
        setStoredOwnerPets([]);
        setState(StepStateEnum.Saved);
        setPet(newPet);
      }
      onNext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setState(StepStateEnum.Error, err.message);
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Steps
      onBack={onBack}
      onNext={handleSubmit}
      submitLoading={submitLoading}
      loadLoading={loadLoading}
      step={step}
      totalSteps={stepStates.length}
      error={error}
    >
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '30px' }}>
        <label>
          Nombre
          <input
            type="text"
            value={pet.name}
            disabled={loadLoading}
            onChange={(e) => setPet({ ...pet, name: e.target.value })}
            required
          />
        </label>

        {pet.image ? (
          <CircularImage
            src={preview}
            width={200}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            onClick={open}
            overlayText="Cambiar foto"
            hoverEnabled={true}
          />
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#4285f4' : '#ccc'}`,
              borderRadius: '4px',
              padding: '1.5rem',
              backgroundColor: isDragActive ? '#e8f0fe' : '#f5f5f5',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={open}
          >
            <input {...getInputProps()} />
            <FaCloudUploadAlt
              style={{ fontSize: '2rem', color: isDragActive ? '#4285f4' : '#888' }}
            />
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
              <b>Selecciona o</b> arrastra y suelta la foto aquí
            </p>
          </div>
        )}
      </div>
    </Steps>
  );
}
