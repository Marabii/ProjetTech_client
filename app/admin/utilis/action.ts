"use server";

import { ParseFormDataInterface } from "./interfaces";
import { parseFormData } from "./parseFormData";
import { ValidateForm } from "./ValidateForm/ValidateForm";
import { ActionReturn } from "./interfaces";
import { convertXlsxToJson } from "./convertXlsxToJson";
import { revalidatePath } from "next/cache";
import handleSubmit from "./handleSubmit";

export async function saveStudentData(
  actionReturn: ActionReturn,
  formData: FormData
): Promise<ActionReturn> {
  try {
    const studentsData: ParseFormDataInterface = parseFormData(formData);
    await ValidateForm(studentsData);
    const dataInJsonFormat = await convertXlsxToJson(studentsData.file);

    await handleSubmit({ data: dataInJsonFormat, type: studentsData.type });
    revalidatePath("/");
    return { status: "success" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: "failure",
        errors: [error.message],
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: "failure",
        errors: ["An unknown error occurred."],
      };
    }
  }
}
