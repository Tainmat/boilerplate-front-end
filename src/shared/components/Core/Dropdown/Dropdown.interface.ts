export interface IDropdown {
  icon?: string;
  text: string;
  route?: string;
  danger?: boolean;
  hide?: boolean;
  onClick?: () => void;
}
