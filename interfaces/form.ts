export enum Type {
  bdd = "bdd",
  defis = "defis",
  stages = "stages",
  majeure = "majeure",
}

export interface ParseFormDataInterface {
  type: Type;
  file: File;
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

export type SheetData = Array<{ [sheetName: string]: any[] }>;
