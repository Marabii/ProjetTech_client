import * as XLSX from "xlsx";

/**
 * Validates an XLSX file to ensure it contains the required sheets and columns.
 *
 * @param file - The XLSX file to validate.
 * @throws Will throw an error if validation fails.
 */
export async function ValidateBdd(file: File): Promise<void> {
  // Define required sheets and their respective required columns
  const requiredSheets: {
    name: string;
    requiredColumns: string[];
  }[] = [
    {
      name: "Entité principale",
      requiredColumns: [
        "Identifiant OP",
        "Etablissement d'origine",
        "Filière",
        "Nationalité",
        "Nom",
        "Prénom",
      ],
    },
    {
      name: "CONVENTION DE STAGE",
      requiredColumns: [
        "Entité principale - Identifiant OP",
        "Entité liée - Date de début du stage",
        "Entité liée - Date de fin du stage",
        "Entité liée - Fonction occupée",
        "Entité liée - Nom",
      ],
    },
    {
      name: "UNIVERSITE visitant",
      requiredColumns: [
        "Entité principale - Identifiant OP",
        "Date de début",
        "Date de fin",
        "Type Mobilité",
        "Entité liée - Nom",
      ],
    },
  ];

  // Read the file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Parse the workbook
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  // Get the actual sheet names from the workbook
  const actualSheetNames = workbook.SheetNames;

  // Validate the number of sheets
  if (actualSheetNames.length !== requiredSheets.length) {
    throw new Error(
      `Invalid number of sheets. Expected ${requiredSheets.length}, but found ${actualSheetNames.length}.`
    );
  }

  // Validate each required sheet and its columns
  for (const requiredSheet of requiredSheets) {
    const { name, requiredColumns } = requiredSheet;

    // Check if the sheet exists
    if (!actualSheetNames.includes(name)) {
      throw new Error(`Missing required sheet: "${name}".`);
    }

    // Get the sheet
    const sheet = workbook.Sheets[name];
    if (!sheet) {
      throw new Error(`Unable to read the sheet: "${name}".`);
    }

    // Convert the first row to get headers
    const sheetJson: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (sheetJson.length === 0) {
      throw new Error(`Sheet "${name}" is empty.`);
    }

    const headers: string[] = sheetJson[0].map((header: any) =>
      String(header).trim()
    );

    // Check for each required column
    for (const column of requiredColumns) {
      if (!headers.includes(column)) {
        throw new Error(
          `Missing required column "${column}" in sheet "${name}".`
        );
      }
    }
  }

  // If all validations pass
  console.log("XLSX file is valid.");
}
