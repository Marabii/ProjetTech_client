import { ActionReturnWithData } from "@/interfaces/form";
import { Etudiant } from "@/interfaces/students";
import { queryProcessor } from "./queryProcessor";

export async function fetchStudents(
  parsedFormData: { [key: string]: any },
  currentPage: number
): Promise<ActionReturnWithData<Etudiant[]>> {
  try {
    const query = queryProcessor(parsedFormData);
    console.log("query: ", query);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/students/`,
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
    const apiResponse: ActionReturnWithData<Etudiant[]> = await response.json();
    return apiResponse;
  } catch (error) {
    throw error;
  }
}
