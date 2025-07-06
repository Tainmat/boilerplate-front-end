import { IRouteProps } from "@shared/routes/routes.interface";
import { lazy } from "react";

import {
  ROUTE_LIST_EQUIPMENTS,
  ROUTE_SAVE_EQUIPMENT,
  ROUTE_UPDATE_EQUIPMENT,
} from "@/modules/Admin/Equipments/routes/Equipment.paths";

const ListEquipments = lazy(() =>
  import("@/modules/Admin/Equipments/pages/ListEquipments").then((module) => ({
    default: module.ListEquipments,
  })),
);

const CreateEquipment = lazy(() =>
  import("@/modules/Admin/Equipments/pages/CreateEquipment").then((module) => ({
    default: module.CreateEquipment,
  })),
);

export const equipmentRoutes: IRouteProps[] = [
  {
    path: ROUTE_LIST_EQUIPMENTS,
    component: ListEquipments,
    isPrivate: true,
  },
  {
    path: ROUTE_SAVE_EQUIPMENT,
    component: CreateEquipment,
    isPrivate: true,
  },
  {
    path: `${ROUTE_UPDATE_EQUIPMENT}/:uuid`,
    component: CreateEquipment,
    isPrivate: true,
  },
];