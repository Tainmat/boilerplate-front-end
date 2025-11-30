import { get } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IEquipment {
  id: string;
  name: string;
  description: string;
  totalInspectionPoints: number;
  isActive: boolean;
  croqui: string;
  created_at: string;
  updated_at: string;
}

export function useEquipments() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IEquipment> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchIn,
        search: params?.value,
        records: params?.items,
        status: params?.status,
        order: params?.order,
        page: params?.page,
      });

      const { data } = await get<IEquipment>("/parametrizations/part-types", queryParams);

      if (data.data.length > 0) {
        setResult({
          data: data.data,
          page: data.page,
          total: data.total,
        });
      } else {
        setResult({
          data: [],
          page: 0,
          total: 0,
        });
      }
    } catch {
      setResult({
        data: [],
        page: 0,
        total: 0,
      });
    }
  }, []);

  function refetch() {
    params && fetchData(params);
  }

  useEffect(() => {
    params && fetchData(params);
  }, [params, fetchData]);

  return { result, params, refetch, setParams };
}
