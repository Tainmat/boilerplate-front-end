export interface IInspectionSearchForm {
  searchingBy?: string | number;
  search?: string;
  inspectionStatusId?: string;
  status?: string;
}

export const initialInspectionSearchValues: IInspectionSearchForm = {
  searchingBy: "",
  search: "",
  inspectionStatusId: "",
  status: "active",
};
