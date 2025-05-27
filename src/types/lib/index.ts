import { PostgrestError, Session } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Dispatch, SetStateAction } from "react";
import { ZodObject } from "zod";

export interface AppSession {
  db: Session;
}

export interface FormType {
  id: string,
  fields: FieldType[]
}

export interface FieldType {
  label: string;
  show: boolean;
  value?: string;
}

export interface MenuType {
  label: string;
  icon: React.JSX.Element,
  url: string;
  showModal?: Dispatch<SetStateAction<boolean>>,
  show: boolean;
}

export interface StepsStateType {
  step: number;
  state: StepStateEnum;
  url?: string;
  error?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodObject<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repository?: FormRepository<any>
}

export enum StepStateEnum {
  NotInitialize = 0,
  Initialize = 1,
  Saved = 2,
  Modified = 3,
  Skipped = 4,
  Error = 5,
}

export type StepConfig<T> = {
  entityName: string;
  storedList: T[];
  setStoredList: (list: T[]) => void;
  emptyFactory: (petId: string) => T;
  fieldsConfig: FieldConfig<T>[];
};

export interface FieldConfig<T> {
  label: string;
  name: keyof T;
  type: "text" | "date";
  mandatory?: boolean;
  className?: string;
}

export interface FormRepository<T> {
  createAll: (list: T[]) => Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[] | null;
    error: PostgrestError | null;
  }>;
  findByParentId: (parent_id: string) => Promise<T[] | null>;
  delete: (id: string) => Promise<boolean>
}

export interface LogInType {
  email: string;
  password?: string;
}
export interface SetSesionType {
  access_token: string;
  refresh_token: string;
}

export interface ApiParams {
  params: Record<string, string>;
};

export type ApiResponse = Promise<NextResponse<{ message: string; success: boolean }>>;

export type ValidationResult<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: NextResponse };


/**
 * Excepción que lanzamos cuando falta un parámetro obligatorio en la query.
 */
export class QueryParamError extends Error { }

/**
 * Excepción que lanzamos cuando falta alguna configuración en los steps.
 */
export class StepStateError extends Error { }

/**
 * Excepción que lanzamos cuando hay un problema en el repositorio.
 */
export class RepositoryError extends Error { }

/**
 * Excepción que lanzamos cuando hay un problema consumiendo un api.
 */
export class ApiError extends Error { }