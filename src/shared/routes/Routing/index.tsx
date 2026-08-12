import { NotFound } from "@modules/Errors/NotFound";
import { Loader } from "@shared/components/Core/Loader";
import { routes } from "@shared/routes/Pages/Pages.routes";
import { RequireAuth } from "@shared/routes/Routing/RequireAuth";
import { AnimatePresence } from "framer-motion";
import { Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

export function Routing() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader />}>
        <Routes key={location.pathname} location={location}>
          <Route path="/">
            {routes.map(({ path, component: Component, isPrivate, allowedRoles }) => (
              <Route
                key={path}
                path={path}
                element={
                  !isPrivate ? (
                    <Component />
                  ) : (
                    <RequireAuth allowedRoles={allowedRoles}>
                      <Component />
                    </RequireAuth>
                  )
                }
              />
            ))}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
