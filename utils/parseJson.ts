import { ActionReturn } from "@/app/admin/utilis/interfaces";

export interface IParseJson {
  isJson: boolean;
  value: ActionReturn | string;
}

export default function parseJson(input: string) {
  try {
    return { isJson: true, value: JSON.parse(input) };
  } catch (error) {
    return { isJson: false, value: input };
  }
}
