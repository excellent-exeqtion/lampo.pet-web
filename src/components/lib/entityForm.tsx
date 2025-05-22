// src/components/forms/entityForm.tsx
"use client";

import React from "react";
import type { Dispatch, SetStateAction } from "react";
import { Form } from "@/components/index";
import { useLoadEntities } from "@/hooks/useLoadEntities";
import { useEntityList } from "@/hooks/useEntityList";
import { useEntitySubmit } from "@/hooks/useEntitySubmit";
import type { FormRepository, FieldConfig, StepsStateType } from "@/types/lib";
import { EntityFields } from "@/components/lib/entityFields";

export interface EntityFormProps<T extends { id?: string }> {
  petId: string;
  data: T[];
  setData: Dispatch<SetStateAction<T[]>>;
  step: number;
  stepStates: StepsStateType[];
  setStepStates: Dispatch<SetStateAction<StepsStateType[]>>;
  entityName: string;
  repository: FormRepository<T>;
  emptyFactory: (petId: string) => Partial<T>;
  fieldsConfig: FieldConfig<T>[];
  onNext: () => void;
  onBack: () => void;
}

export default function EntityForm<T extends { id?: string }>({
  petId,
  data,
  setData,
  step,
  stepStates,
  setStepStates,
  entityName,
  repository,
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
    repository,
    petId,
    data,
    setData,
    step,
    stepStates,
    setStepStates
  );

  // 2) Gestión de la lista en memoria (añadir, eliminar, editar)
  const { addItem, removeItem, updateItem } = useEntityList<T>(
    emptyFactory,
    petId,
    list,
    setList
  );

  // 3) Envío y validación
  const {
    submit,
    loading: submitLoading,
    error: submitError,
  } = useEntitySubmit<T>(
    repository,
    list,
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
    />
  );

  return (
    <Form<T>
      entityList={list}
      step={step}
      entityName={entityName}
      submitLoading={submitLoading}
      loadLoading={loadLoading}
      error={loadError || submitError}
      form={renderFields}
      onBack={onBack}
      handleAdd={addItem}
      handleRemove={removeItem}
      handleSubmit={() => submit(onNext)}
    />
  );
}
