import { ROUTE_HOME } from "@/modules/Home/routes/Home.paths";

interface INavigation {
  icon: string;
  label: string;
  route?: string;
  allowedRoles?: string[];
  mobileVisible?: boolean;
  list?: {
    label: string;
    icon: string;
    route: string;
    mobileVisible?: boolean;
    allowedRoles?: string[];
  }[];
}

export const nav: INavigation[] = [
  {
    icon: "home",
    label: "Página Inicial",
    route: ROUTE_HOME,
    mobileVisible: true,
  },
];
