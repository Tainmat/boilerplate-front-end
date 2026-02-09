import {
  ROLE_ADMINISTRATOR,
  ROLE_CUSTOMER,
  ROLE_INSPECTOR,
  ROLE_SYSTEM_ADMIN,
} from "@shared/constants/user.roles";
import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

import { ROUTE_DASHBOARD } from "./Dashboard.paths";

const Dashboard = lazy(() =>
  import("@modules/Dashboard").then((module) => ({
    default: module.Dashboard,
  })),
);

export const dashboardRoutes: IRouteProps[] = [
  {
    path: ROUTE_DASHBOARD,
    component: Dashboard,
    isPrivate: true,
    allowedRoles: [ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR, ROLE_CUSTOMER, ROLE_INSPECTOR],
  },
];
