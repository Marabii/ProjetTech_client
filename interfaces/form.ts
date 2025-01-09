import { Etudiant } from "./students";

export enum Type {
  bdd = "bdd",
  defis = "defis",
  stages = "stages",
  majeure = "majeure",
}

export interface ParseFormDataInterface {
  type: Type;
  file: File;
  graduationYear: number;
}

export type ActionReturnWithData<T> = {
  status: Status;
  data: T;
  message?: string;
  errors?: string[];
} | null;

export type ActionReturn = {
  status: Status;
  message?: string;
  errors?: string[];
} | null;

export enum Status {
  success = "success",
  failure = "failure",
}

export type SheetData = Array<{ [sheetName: string]: unknown[] }>;

export type SearchResult = {
  students: Etudiant[];
  totalCount: number;
};

export interface SelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  name: string;
  defaultValue?: string;
}
