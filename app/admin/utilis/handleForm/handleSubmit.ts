import { ActionReturn, SheetData } from "@/interfaces/form";

export default async function handleSubmit({
  data,
  type,
}: {
  data: SheetData;
  type: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/api/server/postStudentData?type=${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData: ActionReturn = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error("Error in handleSubmit:", error);
    throw error; // Re-throwing for the caller to handle
  }
}
