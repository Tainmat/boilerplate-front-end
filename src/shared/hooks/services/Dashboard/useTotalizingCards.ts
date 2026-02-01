import { useCallback, useEffect, useState } from "react";

import { IDashboardParams } from "@/modules/Dashboard/pages/Dashboard/useDashboardRules";
import { get } from "@/shared/services/api/api.service";
import { removeEmptyEntries } from "@/shared/utils/generic";

export interface ITotalizingCardData {
  em_analise: {
    amount: number;
    percentage: number;
  };
  aprovado: {
    amount: number;
    percentage: number;
  };
  com_restricao: {
    amount: number;
    percentage: number;
  };
  nao_conforme: {
    amount: number;
    percentage: number;
  };
  total_inspecoes: number;
  taxa_aprovacao: number;
}

export function useTotalizingCards() {
  const [params, setParams] = useState<IDashboardParams | null>(null);
  const [data, setData] = useState<ITotalizingCardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (params: IDashboardParams) => {
    setLoading(true);
    setData(null);
    try {
      const payload = removeEmptyEntries(params);
      const { data } = await get(
        "/operational/parts-inspection/dashboard/totalizing-cards",
        payload,
      );

      if (data) {
        setData(data.data);
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
  }, [fetchData, params]);

  return {
    data,
    loading,
    refetch,
    setParams,
    params,
  };
}
