import { ActionReturn, ParseFormDataInterface } from "../interfaces";
import { ValidateBdd } from "./ValidateBdd";
import { ValidateInternships } from "./ValidateInternships";

export async function ValidateForm(
  data: ParseFormDataInterface
): Promise<ActionReturn> {
  const { type, file } = data;

  switch (type) {
    case "bdd":
      try {
        await ValidateBdd(file);
        return {
          status: "success",
        };
      } catch (e) {
        throw e;
      }

    case "stages":
      try {
        await ValidateInternships(file);
        return {
          status: "success",
        };
      } catch (e) {
        throw e;
      }

    default:
      throw new Error("N'est pas le bon type de fichier");
  }
}
