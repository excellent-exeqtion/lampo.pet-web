import { Session } from "@supabase/supabase-js";

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