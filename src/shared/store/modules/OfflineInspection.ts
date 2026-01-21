import { IInspectionRegisterForm } from "@/modules/Admin/Inspections/pages/CreateInspection/components/RegisterForm/RegisterForm.form";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IOfflineInspectionCard {
  id: string;
  reportNumber: string;
  customerId: string;
  partTypeId: string;
  createdAt: string;
  updatedAt: string;
  isSyncing: boolean;
  erroSync?: string;
  syncAttempts: number;
  quantityPhotos: number;
}

export interface IOfflineInspection extends IInspectionRegisterForm {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface IOfflineInspectionState {
  cardsList: IOfflineInspectionCard[];
  currentInspection: IOfflineInspection | null;
  isSync: boolean;
}

const initialState: IOfflineInspectionState = {
  cardsList: [],
  currentInspection: null,
  isSync: false,
};

const offlineInspectionsSlice = createSlice({
  name: "offlineInspectionsSlice",
  initialState,
  reducers: {
    setCardsList: (state, action: PayloadAction<IOfflineInspectionCard[]>) => {
      state.cardsList = action.payload;
    },

    addCard: (state, action: PayloadAction<IOfflineInspectionCard>) => {
      state.cardsList.push(action.payload);
    },

    updateCard: (
      state,
      action: PayloadAction<{ id: string; data: Partial<IOfflineInspectionCard> }>,
    ) => {
      const index = state.cardsList.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.cardsList[index] = { ...state.cardsList[index], ...action.payload.data };
      }
    },

    removeCard: (state, action: PayloadAction<string>) => {
      state.cardsList = state.cardsList.filter((c) => c.id !== action.payload);
    },

    setCurrentInspection: (state, action: PayloadAction<IOfflineInspection | null>) => {
      state.currentInspection = action.payload;
    },

    clearCurrentInspection: (state) => {
      state.currentInspection = null;
    },

    setIsSync: (state, action: PayloadAction<boolean>) => {
      state.isSync = action.payload;
    },

    resetOfflineInspections: () => initialState,
  },
});

export const {
  addCard,
  clearCurrentInspection,
  removeCard,
  resetOfflineInspections,
  setCardsList,
  setCurrentInspection,
  setIsSync,
  updateCard,
} = offlineInspectionsSlice.actions;
export default offlineInspectionsSlice.reducer;
