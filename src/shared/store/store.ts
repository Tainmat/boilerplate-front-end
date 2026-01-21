import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { encryptionMiddleware, preloadedState } from "./middleware/encryptionMiddleware";

import dropdownsData from "./modules/Dropdowns";
import offlineInspectionsData from "./modules/OfflineInspection";

const reducers = combineReducers({
  dropdownsData,
  offlineInspectionsData,
});

const store = configureStore({
  reducer: reducers,
  preloadedState: preloadedState(),
  devTools: import.meta.env.VITE_AMBIENTE !== "PRODUCTION",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(encryptionMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export { store };
