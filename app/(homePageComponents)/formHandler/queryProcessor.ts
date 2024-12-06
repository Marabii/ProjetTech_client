// queryProcessor.ts

export function queryProcessor(formData: { [key: string]: any }) {
  const query: any = {};

  for (const [field, value] of Object.entries(formData)) {
    if (value === undefined || value === null || value === "") {
      continue; // Skip empty values
    }

    // Handle date fields
    if (
      field.includes("Date de début") ||
      field.includes("Date de fin") ||
      field.includes("Date de début mobilité") ||
      field.includes("Date de fin mobilité") ||
      field.includes("Date de début du stage") ||
      field.includes("Date de fin du stage")
    ) {
      // User provided a year
      const year = parseInt(value, 10);
      const startDate = new Date(`${year}-01-01T00:00:00Z`);
      const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

      query[field] = {
        $gte: startDate,
        $lt: endDate,
      };
    } else {
      // For other fields, perform a case-insensitive regex search
      query[field] = { $regex: value, $options: "i" };
    }
  }

  return query;
}
