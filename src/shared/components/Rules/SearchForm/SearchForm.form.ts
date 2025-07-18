export interface IParamsSearchForm {
  searchingBy?: string | number;
  search?: string;
  status?: "" | "true" | "false";
}

export const initialValuesSchema: IParamsSearchForm = {
  searchingBy: "",
  search: "",
  status: "",
};
