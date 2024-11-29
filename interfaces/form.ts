export enum Type {
  bdd = "bdd",
  defis = "defis",
  stages = "stages",
  majeures = "majeures",
}

export interface ParseFormDataInterface {
  type: Type;
  file: File;
}

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
