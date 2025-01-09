"use server";

import { ActionReturnWithData, SearchResult, Status } from "@/interfaces/form";
import { searchFields } from "@/app/(homePageComponents)/formHandler/searchFields";
import { fetchStudents } from "./fetchStudents";

export async function searchStudentsAction(
  actionReturn: ActionReturnWithData<SearchResult>,
  formData: FormData
): Promise<ActionReturnWithData<SearchResult>> {
  const parsedFormData: { [key: string]: FormDataEntryValue } = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, category] of Object.entries(searchFields)) {
    category.forEach((input) => {
      const fieldValue = formData.get(input.name);
      if (fieldValue) {
        parsedFormData[input.name] = fieldValue;
      }
    });
  }

  const currPage: number = parseInt(
    formData.get("currPage")?.toString() || "1"
  );

  const sortingOrder: string =
    formData.get("sortingOrder")?.toString() || "decreasing";

  try {
    const result = await fetchStudents(parsedFormData, currPage, sortingOrder);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error);
      return {
        status: Status.failure,
        errors: [error.message],
        data: {} as SearchResult,
      };
    } else {
      console.error("An unknown error occurred.");
      return {
        status: Status.failure,
        errors: ["An unknown error occurred."],
        data: {} as SearchResult,
      };
    }
  }
}
