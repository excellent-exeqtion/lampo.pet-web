// src/components/entityForm.tsx
"use client";

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { EntityFields, Form } from "@/components/index";
import { useLoadEntities } from "@/hooks/useLoadEntities";
import { useEntityList } from "@/hooks/useEntityList";
import { useEntitySubmit } from "@/hooks/useEntitySubmit";
import type { FieldConfig, StepsStateType } from "@/types/lib";

export interface EntityFormProps<T extends { id?: string }> {
  id: string;
  storedList: T[];
  setStoredList: (list: T[] | null) => void;
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
  step: number;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<SetStateAction<StepsStateType[]>>;
  entityName: string;
  emptyFactory: (id: string) => Partial<T>;
  fieldsConfig: FieldConfig<T>[];
  onNext: () => void;
  onBack: () => void;
}

export default function EntityFormComponent<T extends { id: string | undefined }>({
  id,
  storedList,
  setStoredList,
  data,
  setData,
  step,
  stepStates,
  setStepStates,
  entityName,
  emptyFactory,
  fieldsConfig,
  onNext,
  onBack,
}: EntityFormProps<T>) {
  // 1) Carga los datos guardados
  const {
    list,
    setList,
    error: loadError,
    setError: setLoadError,
    loading: loadLoading,
  } = useLoadEntities<T>(
    id,
    entityName,
    storedList,
    setStoredList,
    data,
    setData,
    step,
    stepStates,
    setStepStates
  );

  // 2) Gestión de la lista en memoria (añadir, eliminar, editar)
  const { addItem, removeItem, updateItem } = useEntityList<T>(
    emptyFactory,
    id,
    setList,
    setLoadError,
    step,
    stepStates
  );

  // 3) Envío y validación
  const {
    submit,
    loading: submitLoading,
    error: submitError,
  } = useEntitySubmit<T>(
    id,
    list,
    entityName,
    setStoredList,
    setData,
    fieldsConfig,
    step,
    stepStates,
    setStepStates,
    loadError,
    setLoadError
  );

  // 4) Renderizado de campos dinámicos
  const renderFields = (item: T, index: number) => (
    <EntityFields<T>
      fieldsConfig={fieldsConfig}
      item={item}
      index={index}
      loadLoading={loadLoading}
      updateItem={updateItem}
      handleRemove={removeItem}
    />
  );

  return (
    <Form<T>
      entityList={list}
      step={step}
      totalSteps={stepStates.length}
      entityName={entityName}
      submitLoading={submitLoading}
      loadLoading={loadLoading}
      error={loadError || submitError}
      form={renderFields}
      onBack={onBack}
      handleAdd={addItem}
      handleSubmit={() => submit(onNext)}
    />
  );
}
