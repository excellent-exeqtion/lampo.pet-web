// src/components/forms/BasicDataForm.tsx
import React, { Dispatch, useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { PetRepository } from '@/repos/pet.repository';
import { generateUniquePetId } from '@/utils/random';
import { PetStep, PetType } from '@/types/index';
import { StepsStateType, StepStateEnum } from '@/types/lib';
import Steps from '../lib/steps';
import { Step } from '@/utils/index';
import { Empty } from '@/data/index';
import Image from 'next/image';

interface PetFormProps {
  ownerId: string;
  pet: PetType;
  setPet: (pet: PetType) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function BasicDataForm({
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

  // Preview URL for display
  const [preview, setPreview] = useState<string>(pet.image || '/pets/pet.png');

  // Drag & drop handler
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (stateEq(StepStateEnum.NotInitialize) && !pet.id) {
        setState(StepStateEnum.Initialize);
      } else if (stateEq(StepStateEnum.NotInitialize)) {
        const petSaved = await PetRepository.findById(pet.id);
        if (petSaved) {
          setPet(petSaved);
          setSavedData(petSaved);
          setPreview(petSaved.image || preview);
        }
        setState(StepStateEnum.Initialize);
      }
      setLoadLoading(false);
    };
    fetchData();
  }, [pet]);

  useEffect(() => {
    if (
      JSON.stringify(savedData) !== JSON.stringify(pet) &&
      !stateEq(StepStateEnum.NotInitialize)
    ) {
      setState(StepStateEnum.Modified);
    }
  }, [pet]);

  const handleRemove = () => {
    setPet({ ...pet, image: '' });
    setPreview('/pets/pet.png');
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitLoading(true);
    try {
      if (!stateEq(StepStateEnum.Saved) || stateEq(StepStateEnum.Modified)) {
        const newId = pet.id || (await generateUniquePetId());
        const newPet: PetType = {
          id: newId,
          name: pet.name,
          image: pet.image,
          owner_id: ownerId,
        };
        const { error: petErr } = await PetRepository.create(newPet);
        if (petErr) throw new Error(petErr.message);
        setSavedData(newPet);
        setState(StepStateEnum.Saved);
        setPet(newPet);
      }
      onNext();
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
      <div className="grid grid-cols-1 gap-6" style={{ display: 'flow', marginBottom: '20px' }}>
        {/* Nombre */}
        <label>
          Nombre
          <input
            type="text"
            value={pet.name}
            disabled={loadLoading}
            onChange={(e) => setPet({ ...pet, name: e.target.value })}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        {/* Zona Drag & Drop o Preview */}
        {pet.image ? (
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border border-solid border-gray-300 overflow-hidden">
              <Image
                src={preview}
                width={128}
                height={128}
                alt="Foto de mascota"
                className="object-cover w-full h-full"
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
            >
              <FaTimes className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#4285f4' : '#ccc'}`,
              borderRadius: '4px',
              padding: '1.5rem',
              backgroundColor: isDragActive ? '#e8f0fe' : '#f5f5f5',
              width: '100%',
            }}
            className="flex flex-col items-center justify-center cursor-pointer transition-all"
          >
            <input {...getInputProps()} disabled={loadLoading} />
            <FaCloudUploadAlt
              className="w-12 h-12"
              style={{ color: isDragActive ? '#4285f4' : '#888' }}
            />
            <p className="mt-2 text-lg font-semibold text-gray-700">
              <b>Selecciona o</b> arrastra una foto de tu mascota aquí
            </p>
          </div>
        )}
      </div>
    </Steps>
  );
}
