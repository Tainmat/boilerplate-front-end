import { ROUTE_DASHBOARD } from "./Dashboard.paths";
import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";
import { ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR, ROLE_CUSTOMER } from "@shared/constants/user.roles";

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
    allowedRoles: [ROLE_SYSTEM_ADMIN, ROLE_ADMINISTRATOR, ROLE_CUSTOMER],
  },
];