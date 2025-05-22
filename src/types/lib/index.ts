import { PostgrestError, Session } from "@supabase/supabase-js";

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
  show: boolean;
}

export interface StepsStateType {
  number: number;
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
  delete?: (id: string) => Promise<void>
}