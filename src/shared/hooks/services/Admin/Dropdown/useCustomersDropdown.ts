import { removeEmptyEntries } from "@/shared/utils/generic";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

export interface ICustomerDropdown {
  id: string;
  corporateName: string;
  fantasyName: string;
}

export function useCustomersDropdown() {
  const [result, setResult] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setResult([]);

      const queryParams = removeEmptyEntries({
        isActive: true,
      });

      const { data } = await get<{ data: ICustomerDropdown[] }>(
        "parametrizations/customers/dropdown",
        queryParams,
      );

      if (Array.isArray(data.data) && data.data.length > 0) {
        const customers = data.data.map((item: ICustomerDropdown) => ({
          value: item.id,
          label: item.fantasyName || item.corporateName,
        }));

        setResult(customers);
      } else {
        setResult([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setResult([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { result, loading, refetch: fetchData };
}