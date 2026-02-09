export type IToastType = "success" | "helper" | "warning" | "info";

export interface IToastMessage {
  id: string;
  type: IToastType;
  title: string;
  description: string;
}
