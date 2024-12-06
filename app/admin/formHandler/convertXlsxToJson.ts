import * as XLSX from "xlsx";
import { SheetData } from "@/interfaces/form";

/**
 * Converts an XLSX file content to a JSON array while preserving sheet and column names.
 *
 * @param fileContent - The content of the XLSX file as a Buffer or Uint8Array.
 * @returns A promise that resolves to a JSON array in the format [{ sheetName: data }, ...].
 * @throws Will throw an error if the file cannot be parsed.
 */
export async function convertXlsxToJson(file: File): Promise<SheetData> {
  try {
    const fileContent = new Uint8Array(await file.arrayBuffer());
    // Parse the workbook
    const workbook = XLSX.read(fileContent, { type: "buffer" });

    const jsonResult: SheetData = [];

    // Iterate through each sheet in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (sheet) {
        // Convert sheet to JSON with headers as keys
        const sheetData: any[] = XLSX.utils.sheet_to_json(sheet, {
          defval: null,
        });

        // Push the sheet data with sheet name as key
        const sheetObject: { [key: string]: any[] } = {};
        sheetObject[sheetName] = sheetData;
        jsonResult.push(sheetObject);
      }
    });

    return jsonResult;
  } catch (error) {
    throw error;
  }
}
