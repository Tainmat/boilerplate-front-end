export interface IInspectionSearchForm {
  searchingBy?: string | number;
  search?: string;
  inspectionStatusId?: string;
}

export const initialInspectionSearchValues: IInspectionSearchForm = {
  searchingBy: "",
  search: "",
  inspectionStatusId: "",
};