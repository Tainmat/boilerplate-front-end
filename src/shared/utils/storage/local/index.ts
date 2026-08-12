import CryptoJS from "crypto-js";

const storageSecret = import.meta.env.VITE_KEY_CRIPTOGRAFIA;
const userStorageKey = `${storageSecret}:user`;
const customerStorageKey = `${storageSecret}:customer`;

export function getLocalStorageItem(key: string): any {
  const storaged = localStorage.getItem(key);

  if (storaged) {
    const bytes = CryptoJS.AES.decrypt(storaged, storageSecret);
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return data;
  }

  return "";
}

export function setLocalStorageItem(
  key: string,
  value: Record<string, any> | any[] | number | string | boolean,
) {
  const encrypt = CryptoJS.AES.encrypt(JSON.stringify(value), storageSecret).toString();

  localStorage.setItem(key, encrypt);
}

export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key);
}

export function clearLocalStorage(): void {
  removeLocalStorageItem(import.meta.env.VITE_KEY_CRIPTOGRAFIA);
  removeLocalStorageItem(userStorageKey);
  removeLocalStorageItem(customerStorageKey);
}
