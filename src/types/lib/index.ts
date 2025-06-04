import { StorageContextType } from "@/hooks/useAppStorage";
import { AuthError, AuthSession } from "@/lib/auth";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextResponse } from "next/server";
import { Dispatch, SetStateAction } from "react";
import { ZodObject } from "zod";

export interface AppContextType {
  session: AppSession | null;
  logout: () => object;
  storage: StorageContextType;
  showEditPetModal: boolean;
}

export interface AppSession {
  db: AuthSession | null;
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
  setStoredList: (list: T[] | null) => void;
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
  createAll: (list: T[], options: RepositoryOptions) => Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[] | null;
    error: AuthError | null;
  }>;
  findByParentId: (parent_id: string, options: RepositoryOptions) => Promise<T[] | null>;
  delete: (id: string, options: RepositoryOptions) => Promise<boolean>
}

export interface RepositoryOptions {
  cookies?: ReadonlyRequestCookies
}

export interface LogInType {
  email: string;
  password: string;
  role: 'owner' | 'veterinarian';
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
/**
 * Excepción que lanzamos cuando hay un problema con el cliente de autenticación.
 */
export class AuthExceptionError extends Error { }