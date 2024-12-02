"use server";

import { ActionReturnWithData, Status } from "@/interfaces/form";
import { Etudiant } from "@/interfaces/students";
import { names } from "@/app/(homePageComponents)/formHandler/InputFields";
import { fetchStudents } from "./fetchStudents";

export async function searchStudentsAction(
  actionReturn: ActionReturnWithData<Etudiant[]>,
  formData: FormData
): Promise<ActionReturnWithData<Etudiant[]>> {
  const parsedFormData: { [key: string]: FormDataEntryValue } = {};
  names.forEach((inputName) => {
    const fieldValue = formData.get(inputName);
    if (fieldValue) {
      parsedFormData[inputName] = fieldValue;
    }
  });

  const currPage: number = parseInt(
    formData.get("currPage")?.toString() || "1"
  );

  try {
    const result = await fetchStudents(parsedFormData, currPage);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: Status.failure,
        errors: [error.message],
        data: {} as Etudiant[],
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: Status.failure,
        errors: ["An unknown error occurred."],
        data: {} as Etudiant[],
      };
    }
  }
}
