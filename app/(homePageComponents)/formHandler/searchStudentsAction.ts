/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import {
  ActionReturnWithData,
  SearchField,
  SearchResult,
  Status,
} from "@/interfaces/form";
import { searchFields } from "@/app/(homePageComponents)/formHandler/searchFields";
import { fetchStudents } from "./fetchStudents";

export interface ParsedFormData {
  [key: string]: Array<{
    inputValue: FormDataEntryValue;
    context: Record<string, string>[];
  }>;
}

export async function searchStudentsAction(
  actionReturn: ActionReturnWithData<SearchResult>,
  formData: FormData
): Promise<ActionReturnWithData<SearchResult>> {
  const parsedFormData: ParsedFormData = {};

  for (const [_, category] of Object.entries(searchFields)) {
    category.forEach((input: SearchField) => {
      const fieldValue = formData.get(input.name);
      if (fieldValue) {
        const [baseName, uniqueId] = input.name.split("/");
        // For simpler fields (that don't have "/"), uniqueId might be `undefined`

        // Initialize the array if it doesn’t exist yet
        if (!parsedFormData[baseName]) {
          parsedFormData[baseName] = [];
        }

        // Push a new entry for this field
        parsedFormData[baseName].push({
          inputValue: fieldValue,
          context: input.context || [],
        });
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
