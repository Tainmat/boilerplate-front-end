import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDropdownsState {
  inspectionStatusDropdown: IOption[];
  customersDropdown: IOption[];
  equipmentsDropdown: IOption[];
  lastUpdated: string | null;
}

const initialState: IDropdownsState = {
  inspectionStatusDropdown: [],
  customersDropdown: [],
  equipmentsDropdown: [],
  lastUpdated: null,
};

const dropdownStateData = createSlice({
  name: "dropdowns",
  initialState,
  reducers: {
    setInspectionStatusDropdown: (_state, action: PayloadAction<IOption[]>) => {
      return { ..._state, inspectionStatusDropdown: action.payload };
    },
    setCustomersDropdown: (_state, action: PayloadAction<IOption[]>) => {
      return { ..._state, customersDropdown: action.payload };
    },
    setEquipmentsDropdown: (_state, action: PayloadAction<IOption[]>) => {
      return { ..._state, equipmentsDropdown: action.payload };
    },
    setAllDropdowns: (
      state,
      action: PayloadAction<{
        inspectionStatus: IOption[];
        customers: IOption[];
        equipments: IOption[];
      }>,
    ) => {
      state.inspectionStatusDropdown = action.payload.inspectionStatus;
      state.customersDropdown = action.payload.customers;
      state.equipmentsDropdown = action.payload.equipments;
      state.lastUpdated = new Date().toISOString();
    },
    resetDropdowns: () => initialState,
  },
});

export const {
  setInspectionStatusDropdown,
  setCustomersDropdown,
  setEquipmentsDropdown,
  resetDropdowns,
  setAllDropdowns,
} = dropdownStateData.actions;

export default dropdownStateData.reducer;
