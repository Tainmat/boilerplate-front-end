import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import {
  IEquipmentDropdown,
  setAllDropdowns,
  setCustomersDropdown,
  setEquipmentsDropdown,
  setInspectionStatusDropdown,
} from "@/shared/store/modules/Dropdowns";
import { RootState } from "@/shared/store/store";
import { useDispatch, useSelector } from "react-redux";

export function useDropdownsRedux() {
  const dispatch = useDispatch();

  const { customersDropdown, equipmentsDropdown, inspectionStatusDropdown, lastUpdated } =
    useSelector((state: RootState) => state.dropdownsData);

  const setCustomersDropdownAction = (dropdown: IOption[]) =>
    dispatch(setCustomersDropdown(dropdown));

  const setEquipmentsDropdownAction = (dropdown: IEquipmentDropdown[]) =>
    dispatch(setEquipmentsDropdown(dropdown));

  const setInspectionStatusDropdownAction = (dropdown: IOption[]) =>
    dispatch(setInspectionStatusDropdown(dropdown));

  const setAllDropdownsAction = (dropdowns: {
    customers: IOption[];
    equipments: IEquipmentDropdown[];
    inspectionStatus: IOption[];
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
