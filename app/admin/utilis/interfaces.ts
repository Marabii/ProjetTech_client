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
  status: "success" | "failure";
  errors?: string[];
} | null;

export type SheetData = Array<{ [sheetName: string]: any[] }>;
