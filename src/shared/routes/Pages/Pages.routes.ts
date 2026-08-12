import { authRoutes } from "@modules/Auth/routes/Login.routes";
import { IRouteProps } from "@shared/routes/routes.interface";

import { homeRoutes } from "@/modules/Home/routes/Home.routes";

export const routes: IRouteProps[] = [...authRoutes, ...homeRoutes];
