import { PostgrestError, Session } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Dispatch, SetStateAction } from "react";

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
  error?: string | null;
}

export enum StepStateEnum {
  NotInitialize = 0,
  Initialize = 1,
  Saved = 2,
  Modified = 3,
  Skipped = 4,
  Error = 5,
}

export interface DisplayPageType {
  page: number;
  ref:  React.RefObject<boolean>;
}

export interface FieldConfig<T> {
  label: string;
  name: keyof T;
  type: "text" | "date";
  mandatory?: boolean;
  className?: string;
}

export interface FormRepository<T> {
  createAll: (conditions: T[]) => Promise<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[] | null;
    error: PostgrestError | null;
  }>;
  findByParentId: (parent_id: string) => Promise<T[] | null>;
  delete: (id: string) => Promise<void>
}

export interface ApiParams {
  params: Record<string, string>;
};

export type ApiResponse = Promise<NextResponse<{ message: string; success: boolean }>>;

export interface ApiError {
  message: string;
}

export type ValidationResult<T> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: NextResponse };


/**
 * Excepción que lanzamos cuando falta un parámetro obligatorio en la query.
 */
export class QueryParamError extends Error { }