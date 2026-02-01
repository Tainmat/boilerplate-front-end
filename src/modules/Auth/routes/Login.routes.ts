import {
  ROUTE_CHANGE_PASSWORD,
  ROUTE_LOGIN,
  ROUTE_RECOVER_PASSWORD,
} from "@modules/Auth/routes/Login.paths";
import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

const Login = lazy(() =>
  import("@modules/Auth/pages/Login").then((module) => ({
    default: module.Login,
  })),
);

const FirstLogin = lazy(() =>
  import("@modules/Auth/pages/FirstLogin").then((module) => ({
    default: module.FirstLogin,
  })),
);

const RecoverPassword = lazy(() =>
  import("@modules/Auth/pages/RecoverPassword").then((module) => ({
    default: module.RecoverPassword,
  })),
);

export const authRoutes: IRouteProps[] = [
  {
    path: ROUTE_LOGIN,
    component: Login,
  },
  {
    path: ROUTE_RECOVER_PASSWORD,
    component: RecoverPassword,
  },
  {
    path: ROUTE_CHANGE_PASSWORD,
    component: FirstLogin,
  },
];
