import { get } from "@/shared/services/api/api.service";
import { removeEmptyEntries } from "@/shared/utils/generic";
import { useCallback, useEffect, useState } from "react";
import { IDashboardParams } from "./useDashboard";

interface ITotalizingCardData {
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

export interface IDashboardTotalizingCard {
  title: string;
  value: number;
  percentage?: number;
  icon: string;
  status: "success" | "helper" | "warning" | "light" | "primary" | "neutral";
}

export function useTotalizingCards() {
  const [params, setParams] = useState<IDashboardParams | null>(null);
  const [data, setData] = useState<IDashboardTotalizingCard[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (params: IDashboardParams) => {
    try {
      const payload = removeEmptyEntries(params);
      const { data } = await get<ITotalizingCardData>(
        "/operational/parts-inspection/dashboard/totalizing-cards",
        payload,
      );

      const apiData = data.data || data;

      const cards: IDashboardTotalizingCard[] = [
        {
          title: "Total de Inspeções",
          value: apiData.total_inspecoes || 0,
          icon: "assignment",
          status: "primary",
        },
        {
          title: "Inspeções Aprovadas",
          value: apiData.aprovado?.amount || 0,
          percentage: apiData.aprovado?.percentage || 0,
          icon: "check_circle",
          status: "success",
        },
        {
          title: "Não Conforme",
          value: apiData.nao_conforme?.amount || 0,
          percentage: apiData.nao_conforme?.percentage || 0,
          icon: "cancel",
          status: "warning",
        },
        {
          title: "Com Restrição",
          value: apiData.com_restricao?.amount || 0,
          percentage: apiData.com_restricao?.percentage || 0,
          icon: "warning",
          status: "helper",
        },
        {
          title: "Em Análise",
          value: apiData.em_analise?.amount || 0,
          percentage: apiData.em_analise?.percentage || 0,
          icon: "pending_actions",
          status: "neutral",
        },
        {
          title: "Taxa de Aprovação",
          value: Math.round(apiData.taxa_aprovacao),
          icon: "trending_up",
          status: apiData.taxa_aprovacao > 70 ? "success" : "helper",
        },
      ];

      setData(cards);
    } catch (error) {
      setData([]);
    }
  }, []);

  const refetch = useCallback(
    (params: IDashboardParams) => {
      fetchData(params);
    },
    [fetchData],
  );

  useEffect(() => {
    params && fetchData(params);
  }, [fetchData, params]);

  return {
    data,
    loading,
    refetch,
    setParams,
    params,
  };
}
