export interface Form {
  id: string,
  fields: Field[]
}

export interface Field {
  label: string;
  show: boolean;
  value?: string;
}