import CryptoJS from "crypto-js";

export const encrypt = (data: any, secretKey: string) => {
  return import.meta.env.VITE_AMBIENTE === "PRODUCTION"
    ? CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
    : JSON.stringify(data);
};

export const decrypt = (data: any, secretKey: string) => {
  if (import.meta.env.VITE_AMBIENTE === "PRODUCTION") {
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

  return JSON.parse(data);
};
