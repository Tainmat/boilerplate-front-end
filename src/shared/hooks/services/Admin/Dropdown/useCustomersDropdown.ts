import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

import { useAuthContext } from "@/shared/contexts/Auth";
import { removeEmptyEntries } from "@/shared/utils/generic";

import { useAuthRoles } from "../../Rules/Auth/useRoles";

export interface ICustomerDropdown {
  id: string;
  corporateName: string;
  fantasyName: string;
}

interface Props {
  onlyActive?: boolean;
}

export function useCustomersDropdown({ onlyActive }: Props) {
  const { user } = useAuthContext();
  const { isCustomer } = useAuthRoles();
  const [result, setResult] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setResult([]);

      let customers: ICustomerDropdown[] = [];

      const queryParams = removeEmptyEntries({
        onlyActive: onlyActive,
      });

      if (isCustomer()) {
        customers = user?.customers || [];
      } else {
        const { data } = await get("parametrizations/customers/dropdown", queryParams);

        customers = data.data;
      }

      if (Array.isArray(customers) && customers.length > 0) {
        const customersOptions = customers.map((item: ICustomerDropdown) => ({
          value: item.id,
          label: item.fantasyName || item.corporateName,
        }));

        setResult(customersOptions);
      } else {
        setResult([]);
      }
    } catch {
      setResult([]);
    } finally {
      setLoading(false);
    }
  }, [isCustomer, onlyActive, user?.customers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { result, loading, refetch: fetchData };
}
