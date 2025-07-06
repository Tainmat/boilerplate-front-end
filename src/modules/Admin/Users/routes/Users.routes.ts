import {
  ROUTE_LIST_USERS,
  ROUTE_SAVE_USER,
  ROUTE_UPDATE_USER,
} from "@modules/Admin/Users/routes/Users.paths";
import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

const ListUsers = lazy(() =>
  import("@modules/Admin/Users/pages/ListUsers").then((module) => ({
    default: module.ListUsers,
  })),
);

const CreateUsers = lazy(() =>
  import("@modules/Admin/Users/pages/CreateUsers").then((module) => ({
    default: module.CreateUsers,
  })),
);

export const userRoutes: IRouteProps[] = [
  {
    path: ROUTE_LIST_USERS,
    component: ListUsers,
    isPrivate: true,
  },
  {
    path: ROUTE_SAVE_USER,
    component: CreateUsers,
    isPrivate: true,
  },
  {
    path: `${ROUTE_UPDATE_USER}/:uuid`,
    component: CreateUsers,
    isPrivate: true,
  },
];
