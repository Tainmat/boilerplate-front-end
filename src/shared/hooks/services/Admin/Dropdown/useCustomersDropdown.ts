import { removeEmptyEntries } from "@/shared/utils/generic";
import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

export interface ICustomerDropdown {
  id: string;
  corporateName: string;
  fantasyName: string;
}

interface Props {
  onlyActive?: boolean;
}

export function useCustomersDropdown({ onlyActive }: Props) {
  const [result, setResult] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setResult([]);

      const queryParams = removeEmptyEntries({
        onlyActive: onlyActive,
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
