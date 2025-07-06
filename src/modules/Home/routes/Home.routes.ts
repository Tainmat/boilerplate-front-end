import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

const HomePage = lazy(() =>
  import("@modules/Home/pages/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

export const homeRoutes: IRouteProps[] = [
  {
    path: "/",
    component: HomePage,
    isPrivate: true,
  },
  {
    path: ROUTE_HOME,
    component: HomePage,
    isPrivate: true,
  },
];
