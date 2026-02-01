import { useCallback, useEffect, useState } from "react";

import { IDashboardParams } from "@/modules/Dashboard/pages/Dashboard/useDashboardRules";
import { get } from "@/shared/services/api/api.service";
import { removeEmptyEntries } from "@/shared/utils/generic";

export interface ITemporalEvolutionData {
  month: number;
  year: number;
  em_analise: number;
  aprovado: number;
  com_restricao: number;
  nao_conforme: number;
  total_aprovado: number;
}

export function useTemporalEvolution() {
  const [params, setParams] = useState<IDashboardParams | null>(null);
  const [data, setData] = useState<ITemporalEvolutionData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (params: IDashboardParams) => {
    setLoading(true);
    setData(null);
    try {
      const payload = removeEmptyEntries(params);
      const { data: response } = await get(
        "/operational/parts-inspection/dashboard/temporal-evolution",
        payload,
      );

      if (response) {
        setData(response.data || response);
      } else {
        setData(null);
      }
    } catch {
      setData(null);
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
  }, [params, fetchData]);

  return {
    data,
    loading,
    refetch,
    setParams,
    params,
  };
}
