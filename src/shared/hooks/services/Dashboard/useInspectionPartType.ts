import { useCallback, useEffect, useState } from "react";

import { IDashboardParams } from "@/modules/Dashboard/pages/Dashboard/useDashboardRules";
import { get } from "@/shared/services/api/api.service";
import { removeEmptyEntries } from "@/shared/utils/generic";

export interface IInspectionPartType {
  amount: number;
  partTypeId: string;
  partTypeName: string;
}

export function useInspectionPartType() {
  const [params, setParams] = useState<IDashboardParams | null>(null);
  const [data, setData] = useState<IInspectionPartType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (params: IDashboardParams) => {
    setLoading(true);
    setData(null);
    try {
      const payload = removeEmptyEntries(params);
      const { data } = await get(
        "/operational/parts-inspection/dashboard/inspection-part-types",
        payload,
      );

      if (data) {
        setData(data.data);
      } else {
        setData([]);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(
    (params: IDashboardParams) => {
      fetchData(params);
    },
    [fetchData],
  );

  useEffect(() => {
    if (params) {
      fetchData(params);
    }
  }, [fetchData, params]);

  return {
    data,
    loading,
    setParams,
    params,
    refetch,
  };
}
