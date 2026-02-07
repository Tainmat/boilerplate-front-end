import { useDispatch, useSelector } from "react-redux";

import {
  ICustomerOffline,
  IEquipmentDropdown,
  IInpectionStatusOffline,
  IInspectorOffline,
  setAllDropdowns,
  setCustomersDropdown,
  setEquipmentsDropdown,
  setInspectionStatusDropdown,
  setUsersDropdown,
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

  const setUsersDropdownAction = (dropdown: IInspectorOffline[]) =>
    dispatch(setUsersDropdown(dropdown));

  const setAllDropdownsAction = (dropdowns: {
    customers: ICustomerOffline[];
    equipments: IEquipmentDropdown[];
    inspectionStatus: IInpectionStatusOffline[];
    users: IInspectorOffline[];
  }) => dispatch(setAllDropdowns(dropdowns));

  return {
    customersDropdown,
    equipmentsDropdown,
    inspectionStatusDropdown,
    lastUpdated,
    setCustomersDropdownAction,
    setEquipmentsDropdownAction,
    setInspectionStatusDropdownAction,
    setUsersDropdownAction,
    setAllDropdownsAction,
  };
}
