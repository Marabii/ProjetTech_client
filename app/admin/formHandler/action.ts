"use server";

import { parseFormData } from "./parseFormData";
import { ValidateForm } from "../formValidator/ValidateForm";
import { convertXlsxToJson } from "./convertXlsxToJson";
import handleSubmit from "./handleSubmit";
import {
  ActionReturn,
  ParseFormDataInterface,
  Status,
} from "@/interfaces/form";

export async function saveStudentData(
  actionReturn: ActionReturn,
  formData: FormData
): Promise<ActionReturn> {
  try {
    const studentsData: ParseFormDataInterface = parseFormData(formData);
    await ValidateForm(studentsData);
    const dataInJsonFormat = await convertXlsxToJson(studentsData.file);

    const result = await handleSubmit({
      data: dataInJsonFormat,
      type: studentsData.type,
      graduationYear: studentsData.graduationYear,
    });
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: Status.failure,
        errors: [error.message],
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: Status.failure,
        errors: ["An unknown error occurred."],
      };
    }
  }
}
