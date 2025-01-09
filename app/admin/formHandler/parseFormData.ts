import { ParseFormDataInterface, Type } from "@/interfaces/form";

export function parseFormData(formData: FormData): ParseFormDataInterface {
  const type: Type = formData.get("type") as Type;
  const file: File = formData.get("file") as File;
  const graduationYear: number = formData.get(
    "graduationYear"
  ) as unknown as number;
  return { type, file, graduationYear };
}
