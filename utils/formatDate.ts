// src/utils.ts

/**
 * Formats a date string to 'dd/mm/yyyy'.
 * Returns undefined if the date is from the year 1970 or if the input is invalid.
 * @param dateStr - The date string to format.
 * @returns The formatted date string or undefined.
 */
export const formatDate = (dateStr?: string | null): string | undefined => {
  if (!dateStr) return undefined;

  const date = new Date(dateStr);

  // Check if the year is 1970
  if (date.getFullYear() === 1970) return undefined;

  // Check for Invalid Date
  if (isNaN(date.getTime())) return undefined;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
