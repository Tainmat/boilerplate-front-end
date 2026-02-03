import { useDispatch, useSelector } from "react-redux";

import {
  ICustomerOffline,
  IEquipmentDropdown,
  IInpectionStatusOffline,
  setAllDropdowns,
  setCustomersDropdown,
  setEquipmentsDropdown,
  setInspectionStatusDropdown,
} from "@/shared/store/modules/Dropdowns";
import { RootState } from "@/shared/store/store";

export function useDropdownsRedux() {
  const dispatch = useDispatch();

  const { customersDropdown, equipmentsDropdown, inspectionStatusDropdown, lastUpdated } =
    useSelector((state: RootState) => state.dropdownsData);

  const setCustomersDropdownAction = (dropdown: ICustomerOffline[]) =>
    dispatch(setCustomersDropdown(dropdown));

  const setEquipmentsDropdownAction = (dropdown: IEquipmentDropdown[]) =>
    dispatch(setEquipmentsDropdown(dropdown));

  const setInspectionStatusDropdownAction = (dropdown: IInpectionStatusOffline[]) =>
    dispatch(setInspectionStatusDropdown(dropdown));

  const setAllDropdownsAction = (dropdowns: {
    customers: ICustomerOffline[];
    equipments: IEquipmentDropdown[];
    inspectionStatus: IInpectionStatusOffline[];
  }) => dispatch(setAllDropdowns(dropdowns));

  return {
    customersDropdown,
    equipmentsDropdown,
    inspectionStatusDropdown,
    lastUpdated,
    setCustomersDropdownAction,
    setEquipmentsDropdownAction,
    setInspectionStatusDropdownAction,
    setAllDropdownsAction,
  };
}
