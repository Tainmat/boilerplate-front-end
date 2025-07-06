export type IToastType = "success" | "helper" | "warning";

export interface IToastMessage {
  id: string;
  type: IToastType;
  title: string;
  description: string;
}
