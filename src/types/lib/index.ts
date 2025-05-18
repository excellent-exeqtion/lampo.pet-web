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