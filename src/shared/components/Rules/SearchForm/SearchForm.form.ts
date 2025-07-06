export interface IParamsSearchForm {
  searchIn?: string | number;
  value?: string;
  status?: "" | "true" | "false";
}

export const initialValuesSchema: IParamsSearchForm = {
  searchIn: "",
  value: "",
  status: "",
};
