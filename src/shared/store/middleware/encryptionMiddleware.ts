import type { Middleware } from "@reduxjs/toolkit";
import { decrypt, encrypt } from "./criptografia";

const whitelistState = (state: any, whitelist: string[]) => {
  const filteredState: any = {};
  whitelist.forEach((key) => {
    if (key in state) {
      filteredState[key] = state[key];
    }
  });
  return filteredState;
};

export const preloadedState = () => {
  try {
    const encryptedState = window.localStorage.getItem(import.meta.env.VITE_KEY_CRIPTOGRAFIA);
    if (encryptedState) {
      return decrypt(encryptedState, import.meta.env.VITE_KEY_CRIPTOGRAFIA);
    }
  } catch (error) {
    console.warn("Erro ao carregar estado criptografado:", error);
  }
  return undefined;
};

export const encryptionMiddleware: Middleware = (store) => (next) => (action) => {
  // Type guard para verificar se é uma action válida
  if (typeof action === "object" && action !== null && "type" in action) {
    const typedAction = action as { type: string; payload?: any };
    let actionToDispatch = typedAction;

    if (typedAction.type === "persist/REHYDRATE") {
      if (typedAction.payload && typeof typedAction.payload === "string") {
        const decryptedState = decrypt(typedAction.payload, import.meta.env.VITE_KEY_CRIPTOGRAFIA);
        actionToDispatch = {
          ...typedAction,
          payload: decryptedState,
        };
      } else if (typedAction.payload) {
        console.warn("Payload de REHYDRATE não é string encriptada:", typedAction.payload);
      }
    }

    const result = next(actionToDispatch);

    // Só salva o estado após actions que não sejam de inicialização
    if (typedAction.type !== "persist/REHYDRATE") {
      const stateToPersist = whitelistState(store.getState(), ["dropdownsData"]);
      const encryptedState = encrypt(stateToPersist, import.meta.env.VITE_KEY_CRIPTOGRAFIA);
      window.localStorage.setItem(import.meta.env.VITE_KEY_CRIPTOGRAFIA, encryptedState);
    }

    return result;
  }

  // Se não for uma action válida, apenas passa adiante
  return next(action);
};
