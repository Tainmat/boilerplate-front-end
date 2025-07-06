import { ROLE_ADMINISTRATOR, ROLE_CUSTOMER, ROLE_SYSTEM_ADMIN } from "@shared/constants/user.roles";

import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
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
    icon: "home",
    label: "Home",
    route: ROUTE_HOME,
    mobileVisible: true,
  },
  {
    icon: "show_chart",
    label: "Dashboard",
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
        label: "Usuários",
        icon: "person",
        route: ROUTE_LIST_USERS,
        mobileVisible: true,
      },
      {
        label: "Clientes",
        icon: "business",
        route: ROUTE_LIST_CUSTOMERS,
        mobileVisible: true,
      },
      {
        label: "Equipamentos",
        icon: "precision_manufacturing",
        route: ROUTE_LIST_EQUIPMENTS,
        mobileVisible: true,
      },
    ],
  },
];