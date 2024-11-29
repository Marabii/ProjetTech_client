"use server";

import { parseFormData } from "./parseFormData";
import { ValidateForm } from "../ValidateForm/ValidateForm";
import { convertXlsxToJson } from "./convertXlsxToJson";
import { revalidatePath } from "next/cache";
import handleSubmit from "./handleSubmit";
import parseJson from "@/utils/parseJson";
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

    const { status, message, errors }: any = await handleSubmit({
      data: dataInJsonFormat,
      type: studentsData.type,
    });
    revalidatePath("/");
    return { status, message, errors };
  } catch (error: unknown) {
    if (error instanceof Error) {
      const result = parseJson(error.message);
      if (result.isJson) {
        return result.value;
      } else {
        return {
          status: Status.failure,
          errors: [error.message],
        };
      }
    } else {
      console.error("An unknown error occurred.");
      return {
        status: Status.failure,
        errors: ["An unknown error occurred."],
      };
    }
  }
}
