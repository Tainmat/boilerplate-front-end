import { getLocalStorageItem } from "@shared/utils/storage/local";

const userStorageKey = `${import.meta.env.VITE_KEY_CRIPTOGRAFIA}:user`;

export function getAuthorizationToken(): string {
  const token = getLocalStorageItem(userStorageKey);

  return token ? `Bearer ${token.auth.token}` : "";
}
