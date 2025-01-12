// queryProcessor.ts

import { ParsedFormData } from "./searchStudentsAction";

export function queryProcessor(formData: ParsedFormData) {
  // We'll collect a top-level array, where each array item is
  // either a single condition or an $and grouping of multiple conditions.
  const queryConditions: unknown[] = [];

  // Step 1: Loop over each "baseName" in the parsedFormData
  for (const [baseName, entries] of Object.entries(formData)) {
    // `entries` is an array of objects: {inputValue, context, uniqueId}
    // For each item in `entries`, build a sub-condition array
    for (const entry of entries) {
      const { inputValue, context } = entry;

      // Guard clause: skip empty or undefined input
      if (
        !inputValue ||
        (typeof inputValue === "string" && inputValue.trim() === "")
      ) {
        continue;
      }

      // If it's not a string (e.g. file), skip it or handle differently
      if (typeof inputValue !== "string") {
        continue;
      }

      // We'll combine the user's input condition plus any .context
      // into an `$and` group for this one entry:
      const subConditions = [];

      // Step 2: Handle possible "date" vs. "text" logic
      if (
        baseName.includes("Date de début") ||
        baseName.includes("Date de fin") ||
        baseName.includes("Date de début mobilité") ||
        baseName.includes("Date de fin mobilité") ||
        baseName.includes("Date de début du stage") ||
        baseName.includes("Date de fin du stage")
      ) {
        // If the user typed e.g. "2024", parse as year
        const year = parseInt(inputValue, 10);
        if (isNaN(year)) {
          console.warn(`Invalid year for field "${baseName}": "${inputValue}"`);
          continue;
        }

        const startDate = new Date(`${year}-01-01T00:00:00Z`);
        const endDate = new Date(`${year + 1}-01-01T00:00:00Z`);

        // push the date-range condition
        subConditions.push({
          [baseName]: {
            $gte: startDate,
            $lt: endDate,
          },
        });
      } else {
        // For normal text fields, do a case-insensitive regex
        subConditions.push({
          [baseName]: { $regex: inputValue, $options: "i" },
        });
      }

      // Step 3: Merge in any context objects
      // Example context: [ { "DéfiEtMajeure.majeures.promo": "2A" } ]
      // Each context entry can be appended directly.
      subConditions.push(...context);

      // Finally, the single sub-condition for this field's entry is
      // an $and array of everything we collected:
      if (subConditions.length === 1) {
        // If there's only one condition, just use it directly
        queryConditions.push(subConditions[0]);
      } else if (subConditions.length > 1) {
        queryConditions.push({ $and: subConditions });
      }
    }
  }

  // Step 4: combine everything top-level with an $and
  const finalQuery =
    queryConditions.length > 1
      ? { $and: queryConditions }
      : queryConditions[0] || {};

  // console.log("finalQuery:", JSON.stringify(finalQuery, null, 2));
  return finalQuery;
}
