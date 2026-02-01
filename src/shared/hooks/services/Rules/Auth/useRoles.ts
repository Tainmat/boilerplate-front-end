import { useAuthContext } from "@shared/contexts/Auth";
import { useCallback } from "react";

export function useAuthRoles() {
  const { user } = useAuthContext();

  const userRoles = user?.roles;

  const checkIfUserHasRole = useCallback(
    (role: string) => {
      return userRoles?.includes(role) || false;
    },
    [userRoles],
  );

  const isSystemAdmin = useCallback((): boolean => {
    return checkIfUserHasRole(String(import.meta.env.VITE_APP_ROLE_SYSTEM_ADMIN));
  }, [checkIfUserHasRole]);

  const isAdministrator = useCallback((): boolean => {
    return checkIfUserHasRole(String(import.meta.env.VITE_APP_ROLE_ADMINISTRATOR));
  }, [checkIfUserHasRole]);

  const isInspector = useCallback((): boolean => {
    return checkIfUserHasRole(String(import.meta.env.VITE_APP_ROLE_INSPECTOR));
  }, [checkIfUserHasRole]);

  const isCustomer = useCallback((): boolean => {
    return checkIfUserHasRole(String(import.meta.env.VITE_APP_ROLE_CUSTOMER));
  }, [checkIfUserHasRole]);

  const isRegister = useCallback((): boolean => {
    return isAdministrator() || isSystemAdmin();
  }, [isAdministrator, isSystemAdmin]);

  const isInspectionChanger = useCallback((): boolean => {
    return isSystemAdmin() || isInspector();
  }, [isSystemAdmin, isInspector]);

  const handleUserRoles = useCallback((roles: Array<{ sigla: string }>): string[] => {
    if (!roles || !roles.length) return [];

    return roles.map((role) => role.sigla);
  }, []);

  return {
    checkIfUserHasRole,
    isSystemAdmin,
    isAdministrator,
    isInspector,
    isCustomer,
    isRegister,
    isInspectionChanger,
    handleUserRoles,
  };
}
