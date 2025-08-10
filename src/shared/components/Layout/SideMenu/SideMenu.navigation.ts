import { ROLE_ADMINISTRATOR, ROLE_CUSTOMER, ROLE_SYSTEM_ADMIN } from "@shared/constants/user.roles";

import { ROUTE_LIST_USERS } from "@/modules/Admin/Users/routes/Users.paths";
import { ROUTE_LIST_CUSTOMERS } from "@/modules/Admin/Customers/routes/Customer.paths";
import { ROUTE_LIST_EQUIPMENTS } from "@/modules/Admin/Equipments/routes/Equipment.paths";
import { ROUTE_LIST_INSPECTIONS } from "@/modules/Admin/Inspections/routes/Inspection.paths";
import { ROUTE_DASHBOARD } from "@/modules/Dashboard/routes/Dashboard.paths";

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
  }[];
}

export const nav: INavigation[] = [
  {
    icon: "show_chart",
    label: "Página Inicial",
    route: ROUTE_DASHBOARD,
    mobileVisible: true,
    allowedRoles: [ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR, ROLE_CUSTOMER],
  },
  {
    icon: "assignment",
    label: "Inspeções",
    route: ROUTE_LIST_INSPECTIONS,
    mobileVisible: true,
    allowedRoles: [ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR],
  },
  {
    icon: "multiline_chart",
    label: "Cadastros",
    mobileVisible: true,
    allowedRoles: [ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR],
    list: [
      {
        icon: "",
        label: "Usuários",
        route: ROUTE_LIST_USERS,
        mobileVisible: true,
      },
      {
        icon: "",
        label: "Clientes",
        route: ROUTE_LIST_CUSTOMERS,
        mobileVisible: true,
      },
      {
        icon: "",
        label: "Equipamentos",
        route: ROUTE_LIST_EQUIPMENTS,
        mobileVisible: true,
      },
    ],
  },
];
