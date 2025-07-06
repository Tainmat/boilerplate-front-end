export type IAlertType = "success" | "helper" | "warning";

export interface IAlertMessage {
  iconModal?: string;
  titleModal?: string;
  iconType: IAlertType;
  buttonType: IAlertType;
  title: string;
  subtitle?: string;
  description: string;
  cancelTxt: string;
  confirmTxt: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}
