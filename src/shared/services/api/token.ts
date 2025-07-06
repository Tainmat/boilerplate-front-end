import { getLocalStorageItem } from "@shared/utils/storage/local";

export function getAuthorizationToken(): string {
  const token = getLocalStorageItem("LatiniGroup@SGP:user");

  return token ? `Bearer ${token.auth.token}` : "";
}
