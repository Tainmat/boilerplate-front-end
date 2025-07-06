import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

import {
  ROUTE_LIST_INSPECTIONS,
  ROUTE_SAVE_INSPECTION,
  ROUTE_UPDATE_INSPECTION,
} from "@/modules/Admin/Inspections/routes/Inspection.paths";

const ListInspections = lazy(() =>
  import("@/modules/Admin/Inspections/pages/ListInspections").then((module) => ({
    default: module.ListInspections,
  })),
);

const CreateInspection = lazy(() =>
  import("@/modules/Admin/Inspections/pages/CreateInspection").then((module) => ({
    default: module.CreateInspection,
  })),
);

export const inspectionRoutes: IRouteProps[] = [
  {
    path: ROUTE_LIST_INSPECTIONS,
    component: ListInspections,
    isPrivate: true,
  },
  {
    path: ROUTE_SAVE_INSPECTION,
    component: CreateInspection,
    isPrivate: true,
  },
  {
    path: `${ROUTE_UPDATE_INSPECTION}/:uuid`,
    component: CreateInspection,
    isPrivate: true,
  },
];