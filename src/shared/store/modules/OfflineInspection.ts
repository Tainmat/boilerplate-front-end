import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IInspectionRegisterForm } from "@/modules/Admin/Inspections/pages/CreateInspection/components/RegisterForm/RegisterForm.form";

interface IOfflineInspectionAdditionalData {
  partType: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    fantasyName: string;
    corporateName: string;
  };
  inspectorUser: {
    id: string;
    name: string;
  };
  inspectionStatus: {
    id: string;
    description: string;
  };
  isActive: boolean;
}

export interface IOfflineInspectionCard extends IOfflineInspectionAdditionalData {
  id: string;
  reportNumber: string;
  revisionNumber: string;
  createdAt: string;
  updatedAt: string;
  isSyncing: boolean;
  erroSync?: string;
  syncAttempts: number;
  quantityPhotos: number;
}

interface IOfflineRegisterForm extends IInspectionRegisterForm, IOfflineInspectionAdditionalData {}

export interface IOfflineInspection extends IOfflineRegisterForm {
  id: string;
  createdAt: string;
  updatedAt: string;
  isSyncing: boolean;
  erroSync?: string;
  syncAttempts: number;
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

    setCurrent: (state, action: PayloadAction<IOfflineInspection | null>) => {
      state.currentInspection = action.payload;
    },

    clearCurrent: (state) => {
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
  clearCurrent,
  removeCard,
  resetOfflineInspections,
  setCardsList,
  setCurrent,
  setIsSync,
  updateCard,
} = offlineInspectionsSlice.actions;
export default offlineInspectionsSlice.reducer;
