import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IEquipment } from "@/shared/hooks/services/Admin/useEquipments";

export type IEquipmentDropdown = Pick<
  IEquipment,
  "id" | "name" | "totalInspectionPoints" | "croqui" | "description"
>;

export interface ICustomerOffline {
  id: string;
  fantasyName: string;
  corporateName: string;
}

export interface IInpectionStatusOffline {
  id: string;
  description: string;
}

export interface IInspectorOffline {
  id: string;
  socialName: string;
}

interface IDropdownsState {
  inspectionStatusDropdown: IInpectionStatusOffline[];
  customersDropdown: ICustomerOffline[];
  equipmentsDropdown: IEquipmentDropdown[];
  usersDropdown: IInspectorOffline[];
  lastUpdated: string | null;
}

const initialState: IDropdownsState = {
  inspectionStatusDropdown: [],
  customersDropdown: [],
  equipmentsDropdown: [],
  usersDropdown: [],
  lastUpdated: null,
};

const dropdownStateData = createSlice({
  name: "dropdowns",
  initialState,
  reducers: {
    setInspectionStatusDropdown: (_state, action: PayloadAction<IInpectionStatusOffline[]>) => {
      return { ..._state, inspectionStatusDropdown: action.payload };
    },
    setCustomersDropdown: (_state, action: PayloadAction<ICustomerOffline[]>) => {
      return { ..._state, customersDropdown: action.payload };
    },
    setEquipmentsDropdown: (_state, action: PayloadAction<IEquipmentDropdown[]>) => {
      return { ..._state, equipmentsDropdown: action.payload };
    },
    setUsersDropdown: (_state, action: PayloadAction<IInspectorOffline[]>) => {
      return { ..._state, usersDropdown: action.payload };
    },
    setAllDropdowns: (
      state,
      action: PayloadAction<{
        inspectionStatus: IInpectionStatusOffline[];
        customers: ICustomerOffline[];
        equipments: IEquipmentDropdown[];
        users: IInspectorOffline[];
      }>,
    ) => {
      state.inspectionStatusDropdown = action.payload.inspectionStatus;
      state.customersDropdown = action.payload.customers;
      state.equipmentsDropdown = action.payload.equipments;
      state.usersDropdown = action.payload.users;
      state.lastUpdated = new Date().toISOString();
    },
    resetDropdowns: () => initialState,
  },
});

export const {
  setInspectionStatusDropdown,
  setCustomersDropdown,
  setEquipmentsDropdown,
  setUsersDropdown,
  resetDropdowns,
  setAllDropdowns,
} = dropdownStateData.actions;

export default dropdownStateData.reducer;
