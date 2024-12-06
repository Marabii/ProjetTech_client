import * as XLSX from "xlsx";

/**
 * Validates an XLSX file to ensure it contains a single sheet with the required columns: Prénom, Nom, Défi.
 *
 * @param file - The XLSX file to validate.
 * @throws Will throw an error if the file does not meet the validation criteria.
 */
export async function ValidateMajeure(file: File): Promise<void> {
  // Define the required headers
  const requiredHeaders = ["Prénom", "Nom", "A", "Majeure"];

  try {
    // Read the file as an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Parse the workbook using the XLSX library
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Retrieve the sheet names from the workbook
    const sheetNames = workbook.SheetNames;

    // Validate that there is exactly one sheet
    if (sheetNames.length !== 1) {
      throw new Error(
        `Invalid number of sheets. Expected 1, but found ${sheetNames.length}.`
      );
    }

    const sheetName = sheetNames[0];
    if (sheetName !== "Alpha") {
      throw new Error("sheet name must be Alpha");
    }
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Unable to read the sheet: "${sheetName}".`);
    }

    // Convert the sheet to a JSON array where each sub-array represents a row
    const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (sheetData.length === 0) {
      throw new Error(`Sheet "${sheetName}" is empty.`);
    }

    // Extract headers from the first row and trim any whitespace
    const headers: string[] = sheetData[0].map((header: any) =>
      String(header).trim()
    );

    // Check for the presence of each required header
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Missing required column(s): ${missingHeaders.join(", ")}.`
      );
    }

    // If all validations pass
    console.log("XLSX file is valid.");
  } catch (error: any) {
    // Handle and rethrow errors for upstream handling
    throw new Error(`Validation failed: ${error.message}`);
  }
}
