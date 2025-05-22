// src/components/forms/ConditionForm.tsx
"use client";

import React from 'react';
import { ConditionRepository } from '@/repos/condition.repository';
import type { ConditionDataType } from '@/types/index';
import { PetStep } from '@/types/index';
import { Form } from '@/components/index';
import { useLoadEntities } from '@/hooks/useLoadEntities';
import { useEntityList } from '@/hooks/useEntityList';
import { useEntitySubmit } from '@/hooks/useEntitySubmit';
import { FieldConfig, StepsStateType } from '@/types/lib';
import { emptyCondition } from '@/utils/factories';
import { EntityFields } from '../lib/entityFields';

interface ConditionFormProps {
  petId: string;
  conditionsData: ConditionDataType[];
  setConditionsData: (conditions: ConditionDataType[]) => void;
  onNext: () => void;
  onBack: () => void;
  stepStates: StepsStateType[];
  setStepStates: React.Dispatch<React.SetStateAction<StepsStateType[]>>;
}

export default function ConditionForm({
  petId,
  conditionsData,
  setConditionsData,
  onNext,
  onBack,
  stepStates,
  setStepStates,
}: ConditionFormProps) {
  const step = PetStep.Conditions;
  const entityName = 'condición';

  const {
    list: conditions,
    setList: setConditions,
    error: loadError,
    setError: setLoadError,
    loading: loadLoading,
    setLoading: setLoadLoading
  } = useLoadEntities<ConditionDataType>(
    new ConditionRepository(),
    petId,
    conditionsData,
    setConditionsData,
    step,
    stepStates,
    setStepStates
  );

  const { addItem, removeItem, updateItem } = useEntityList<ConditionDataType>(
    emptyCondition,
    petId,
    conditions,
    setConditions
  );

  const fieldsConfig: FieldConfig<ConditionDataType>[] = [
    { label: 'Condición *', name: 'condition', type: 'text', mandatory: true, className: 'w-full' },
    { label: 'Severidad *', name: 'severity', type: 'text', mandatory: true, className: 'w-full' },
  ];

  const {
    submit,
    loading: submitLoading,
    error: submitError,
  } = useEntitySubmit<ConditionDataType>(
    conditions,
    fieldsConfig,
    ConditionRepository.createAll,
    step,
    stepStates,
    setStepStates,
    loadError,
    setLoadError,
    loadLoading,
    setLoadLoading
  );

  const renderFields = (item: ConditionDataType, index: number) => (
    <EntityFields
      fieldsConfig={fieldsConfig}
      item={item}
      index={index}
      updateItem={updateItem}
    />
  );

  return (
    <Form
      entityList={conditions}
      step={step}
      entityName={entityName}
      loading={loadLoading || submitLoading}
      error={loadError || submitError}
      form={renderFields}
      onBack={onBack}
      handleAdd={addItem}
      handleRemove={removeItem}
      handleSubmit={() => submit(onNext)}
    />
  );
}