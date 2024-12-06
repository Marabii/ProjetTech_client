import { ParseFormDataInterface, Type } from "@/interfaces/form";

export function parseFormData(formData: FormData): ParseFormDataInterface {
  const type: Type = formData.get("type") as Type;
  const file: File = formData.get("file") as File;

  return { type, file };
}
