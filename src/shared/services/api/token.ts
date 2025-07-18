import { getLocalStorageItem } from "@shared/utils/storage/local";

export function getAuthorizationToken(): string {
  const token = getLocalStorageItem("Usincheck@JOmetto:user");

  return token ? `Bearer ${token.auth.token}` : "";
}
