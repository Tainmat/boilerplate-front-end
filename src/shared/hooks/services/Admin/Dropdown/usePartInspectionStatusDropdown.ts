import { IOption } from "@shared/components/Core/Form/Fields/Select/Select.interface";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

import { removeEmptyEntries } from "@/shared/utils/generic";

export interface IPartInspectionStatusDropdown {
  id: string;
  name: string;
  description?: string;
}

export function usePartInspectionStatusDropdown() {
  const [result, setResult] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setResult([]);

      const queryParams = removeEmptyEntries({
        isActive: true,
      });

      const { data } = await get("parametrizations/part-inspection-status/dropdown", queryParams);

      if (Array.isArray(data.data) && data.data.length > 0) {
        const statuses = data.data.map((item: IPartInspectionStatusDropdown) => ({
          value: item.id,
          label: item.description,
        }));

        setResult(statuses);
      } else {
        setResult([]);
      }
    } catch {
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
