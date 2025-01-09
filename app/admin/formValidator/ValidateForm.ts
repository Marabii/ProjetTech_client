import {
  ActionReturn,
  ParseFormDataInterface,
  Status,
} from "@/interfaces/form";
import { ValidateBdd } from "./ValidateBdd";
import { ValidateInternships } from "./ValidateInternships";
import { ValidateDefis } from "./ValidateDefis";
import { ValidateMajeure } from "./ValidateMajeure";

export async function ValidateForm(
  data: ParseFormDataInterface
): Promise<ActionReturn> {
  const { type, file, graduationYear } = data;

  if (type === "bdd" && !graduationYear) {
    throw new Error("Année de diplomation est manquante");
  }

  switch (type) {
    case "bdd":
      try {
        await ValidateBdd(file);
        return {
          status: Status.success,
        };
      } catch (e) {
        throw e;
      }

    case "stages":
      try {
        await ValidateInternships(file);
        return {
          status: Status.success,
        };
      } catch (e) {
        throw e;
      }

    case "defis":
      try {
        await ValidateDefis(file);
        return {
          status: Status.success,
        };
      } catch (e) {
        throw e;
      }

    case "majeure":
      try {
        await ValidateMajeure(file);
        return {
          status: Status.success,
        };
      } catch (e) {
        throw e;
      }

    default:
      throw new Error("N'est pas le bon type de fichier");
  }
}
