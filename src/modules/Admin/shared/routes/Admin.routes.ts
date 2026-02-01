import { customersRoutes } from "@modules/Admin/Customers/routes/Customer.routes";
import { equipmentRoutes } from "@modules/Admin/Equipments/routes/Equipment.routes";
import { inspectionRoutes } from "@modules/Admin/Inspections/routes/Inspection.routes";
import { userRoutes } from "@modules/Admin/Users/routes/Users.routes";
import { IRouteProps } from "@shared/routes/routes.interface";

export const adminRoutes: IRouteProps[] = [
  ...userRoutes,
  ...customersRoutes,
  ...equipmentRoutes,
  ...inspectionRoutes,
];
