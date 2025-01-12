import { ActionReturnWithData, SearchResult } from "@/interfaces/form";
import { queryProcessor } from "./queryProcessor";
import { ParsedFormData } from "./searchStudentsAction";

export async function fetchStudents(
  parsedFormData: ParsedFormData,
  currentPage: number,
  sortingOrder: string
): Promise<ActionReturnWithData<SearchResult>> {
  try {
    const query = queryProcessor(parsedFormData);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/students/?sortingOrder=${sortingOrder}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...query,
          page: currentPage,
          limit: 20,
        }),
      }
    );
    const apiResponse: ActionReturnWithData<SearchResult> =
      await response.json();
    return apiResponse;
  } catch (error) {
    throw error;
  }
}
