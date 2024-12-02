import { ActionReturnWithData, Status } from "@/interfaces/form";
import { Etudiant } from "@/interfaces/students";

export async function fetchStudents(
  parsedFormData: { [key: string]: any },
  currentPage: number
): Promise<ActionReturnWithData<Etudiant[]>> {
  try {
    const query: { [key: string]: any } = {};
    for (const fieldName in parsedFormData) {
      if (parsedFormData[fieldName] !== "") {
        if (fieldName) {
          // Handle nested fields for arrays
          if (
            fieldName.includes("CONVENTION DE STAGE") ||
            fieldName.includes("UNIVERSITE visitant")
          ) {
            const [arrayField, subField] = fieldName.split(".");
            query[arrayField] = query[arrayField] || {};
            query[arrayField][subField] = parsedFormData[fieldName];
          } else {
            query[fieldName] = parsedFormData[fieldName];
          }
        }
      }
    }

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

    if (apiResponse?.status === Status.success) {
      return apiResponse;
    } else {
      throw new Error(JSON.stringify(apiResponse));
    }
  } catch (error) {
    throw error;
  }
}
