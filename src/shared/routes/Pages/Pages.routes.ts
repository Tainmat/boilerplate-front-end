import { authRoutes } from "@modules/Auth/routes/Login.routes";
import { homeRoutes } from "@/modules/Home/routes/Home.routes";
import { adminRoutes } from "@modules/Admin/shared/routes/Admin.routes";
import { dashboardRoutes } from "@modules/Dashboard/routes/Dashboard.routes";
import { IRouteProps } from "@shared/routes/routes.interface";

//import { proccessesRoutes } from "@/modules/Proccesses/shared/routes/Proccesses.routes";

export const routes: IRouteProps[] = [
  ...authRoutes,
  ...homeRoutes,
  ...adminRoutes,
  ...dashboardRoutes,
  //...proccessesRoutes,
];
