import { useCallback } from "react";

import { IOption } from "@/shared/components/Core/Form/Fields/Select/Select.interface";
import { useToastContext } from "@/shared/contexts/Toast";
import { useDropdownsRedux } from "@/shared/hooks/redux/useDropdownsRedux";
import { get } from "@/shared/services/api/api.service";
import { IEquipmentDropdown } from "@/shared/store/modules/Dropdowns";
import { removeEmptyEntries } from "@/shared/utils/generic";

import { IEquipment } from "../useEquipments";
import { ICustomerDropdown } from "./useCustomersDropdown";
import { IPartInspectionStatusDropdown } from "./usePartInspectionStatusDropdown";

export function useLoadAllDropdowns() {
  const { setAllDropdownsAction } = useDropdownsRedux();
  const { addToast } = useToastContext();

  const loadDropdowns = useCallback(async () => {
    const queryParams = removeEmptyEntries({
      onlyActive: true,
    });

    try {
      const [statusRes, customersRes, equipmentsRes] = await Promise.all([
        get("parametrizations/part-inspection-status/dropdown", queryParams),
        get("parametrizations/customers/dropdown", queryParams),
        get("parametrizations/part-types", {
          status: "active",
        }),
      ]);

      const statusDropdown: IOption[] = statusRes.data.data.map(
        (item: IPartInspectionStatusDropdown) => {
          return {
            label: item.description,
            value: item.id,
          };
        },
      );

      const customersDropdown: IOption[] = customersRes.data.data.map((item: ICustomerDropdown) => {
        return {
          label: item.fantasyName,
          value: item.id,
        };
      });

      const equipmentsDropdown: IEquipmentDropdown[] = equipmentsRes.data.data.map(
        (item: IEquipment) => {
          return {
            id: item.id,
            name: item.name,
            totalInspectionPoints: item.totalInspectionPoints,
            croqui: item.croqui,
          };
        },
      );

      setAllDropdownsAction({
        inspectionStatus: statusDropdown,
        customers: customersDropdown,
        equipments: equipmentsDropdown,
      });
    } catch {
      setAllDropdownsAction({
        inspectionStatus: [],
        customers: [],
        equipments: [],
      });

      addToast({
        description:
          "Não foi possível carregar os dados para trabalhar offline, por favor tente carregar novamente antes de ficar Offline",
        title: "Oooops!",
        type: "warning",
      });
    }
  }, [addToast, setAllDropdownsAction]);

  return { loadDropdowns };
}
