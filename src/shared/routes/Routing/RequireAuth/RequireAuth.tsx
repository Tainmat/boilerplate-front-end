import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { useAuthContext } from "@shared/contexts/Auth";
import { useToastContext } from "@shared/contexts/Toast";
import { useAuthRoles } from "@shared/hooks/services/Rules/Auth/useRoles";
import { JSX, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  allowedRoles?: string[];
  children: JSX.Element;
}

export function RequireAuth({ allowedRoles, children }: Props) {
  const { loaded, user } = useAuthContext();
  const { addToast } = useToastContext();

  const { checkIfUserHasRole } = useAuthRoles();

  useEffect(() => {
    if (loaded && allowedRoles) {
      const hasPermission = allowedRoles.some((role: string) => checkIfUserHasRole(role));

      if (!hasPermission) {
        addToast({
          type: "warning",
          title: "Oops",
          description: "Permissão negada.",
        });
      }
    }
  }, [loaded, allowedRoles, checkIfUserHasRole, addToast]);

  if (!loaded) return null;

  if (!user) return <Navigate to={ROUTE_LOGIN} replace={true} />;

  if (!allowedRoles) return children;

  const hasPermission = allowedRoles.some((role: string) => checkIfUserHasRole(role));

  if (hasPermission) return children;

  return <Navigate to={ROUTE_HOME} />;
}

RequireAuth.defaultProps = {
  allowedRoles: undefined,
};
