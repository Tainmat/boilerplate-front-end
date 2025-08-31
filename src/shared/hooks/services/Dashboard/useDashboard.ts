import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";

export interface IDashboardPartType {
  partTypeId: string;
  partTypeName: string;
  amount: number;
}

export interface IDashboardTemporalEvolution {
  month: number;
  year: number;
  em_analise: number;
  aprovado: number;
  aprovado_com_restricao: number;
  nao_conforme: number;
  total_aprovado: number;
}

export interface IDashboardTotalizingCard {
  title: string;
  value: number;
  percentage?: number;
  icon: string;
  status: "success" | "helper" | "warning" | "light" | "primary" | "neutral";
}

export interface IApiTotalizingCardsResponse {
  aprovado: {
    amount: number;
    percentage: number;
  };
  aprovado_com_restricao: {
    amount: number;
    percentage: number;
  };
  em_analise: {
    amount: number;
    percentage: number;
  };
  nao_conforme: {
    amount: number;
    percentage: number;
  };
  taxa_aprovacao: number;
  total_inspecoes: number;
}

export interface IDashboardInspection {
  id: string;
  reportNumber: string;
  revisionNumber: string;
  reportStartDate: string;
  reportEndDate: string;
  customer: {
    id: string;
    corporateName: string;
    fantasyName: string;
  };
  inspectorUser: {
    id: string;
    name: string;
  };
  partType: {
    id: string;
    name: string;
  };
  inspectionStatus: {
    id: string;
    description: string;
  };
}

export interface IDashboardData {
  partTypes: IDashboardPartType[];
  temporalEvolution: IDashboardTemporalEvolution[];
  totalizingCards: IDashboardTotalizingCard[];
  latestInspections: IDashboardInspection[];
}

// Função para converter período em datas
const getPeriodDates = (period: string) => {
  const today = new Date();
  const finalDate = new Date(today);
  const initialDate = new Date(today);

  switch (period) {
    case "last30days":
      initialDate.setDate(today.getDate() - 30);
      break;
    case "last90days":
      initialDate.setDate(today.getDate() - 90);
      break;
    case "last6months":
      initialDate.setMonth(today.getMonth() - 6);
      break;
    case "last12months":
    default:
      initialDate.setMonth(today.getMonth() - 12);
      break;
  }

  return {
    initialReportStartDate: format(initialDate, "yyyy-MM-dd"),
    finalReportStartDate: format(finalDate, "yyyy-MM-dd"),
  };
};

export function useDashboard(period?: string) {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartTypes = useCallback(
    async (periodParam?: string): Promise<IDashboardPartType[]> => {
      try {
        const params = getPeriodDates(periodParam || "last12months");
        const { data } = await get<IDashboardPartType[]>(
          "/operational/parts-inspection/dashboard/inspection-part-types",
          params,
        );
        return data.data || [];
      } catch (error) {
        console.error("Error fetching part types:", error);
        return [];
      }
    },
    [],
  );

  const fetchTemporalEvolution = useCallback(
    async (periodParam?: string): Promise<IDashboardTemporalEvolution[]> => {
      try {
        const params = getPeriodDates(periodParam || "last12months");
        const { data } = await get<IDashboardTemporalEvolution[]>(
          "/operational/parts-inspection/dashboard/temporal-evolution",
          params,
        );
        return data.data || [];
      } catch (error) {
        console.error("Error fetching temporal evolution:", error);
        return [];
      }
    },
    [],
  );

  const fetchTotalizingCards = useCallback(
    async (periodParam?: string): Promise<IDashboardTotalizingCard[]> => {
      try {
        const params = getPeriodDates(periodParam || "last12months");
        const { data } = await get<IApiTotalizingCardsResponse>(
          "/operational/parts-inspection/dashboard/totalizing-cards",
          params,
        );

        // Mapear o retorno da API para cards amigáveis
        const apiData = data.data || data;

        // Calcular taxa de aprovação (média entre aprovadas e não conforme)
        const totalAprovadas = apiData.aprovado?.amount || 0;
        const totalNaoConforme = apiData.nao_conforme?.amount || 0;
        const totalParaCalculo = totalAprovadas + totalNaoConforme;
        const taxaAprovacao = totalParaCalculo > 0 ? (totalAprovadas / totalParaCalculo) * 100 : 0;

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
            title: "Com Restrições",
            value: apiData.aprovado_com_restricao?.amount || 0,
            percentage: apiData.aprovado_com_restricao?.percentage || 0,
            icon: "warning",
            status: "helper",
          },
          {
            title: "Taxa de Aprovação",
            value: Math.round(taxaAprovacao),
            icon: "trending_up",
            status: taxaAprovacao > 70 ? "success" : "helper",
          },
        ];

        return cards;
      } catch (error) {
        console.error("Error fetching totalizing cards:", error);
        return [];
      }
    },
    [],
  );

  const fetchLatestInspections = useCallback(
    async (periodParam?: string): Promise<IDashboardInspection[]> => {
      try {
        const params = {
          ...getPeriodDates(periodParam || "last12months"),
          records: 10, // Últimas 10 inspeções
          page: 1,
          order: "reportEndDate", // Mais recentes primeiro
        };
        const { data } = await get<{ data: IDashboardInspection[] }>(
          "/operational/parts-inspection",
          params,
        );
        return data.data || [];
      } catch (error) {
        console.error("Error fetching latest inspections:", error);
        return [];
      }
    },
    [],
  );

  const loadDashboardData = useCallback(
    async (periodParam?: string) => {
      setLoading(true);
      setError(null);

      try {
        const [partTypes, temporalEvolution, totalizingCards, latestInspections] =
          await Promise.all([
            fetchPartTypes(periodParam),
            fetchTemporalEvolution(periodParam),
            fetchTotalizingCards(periodParam),
            fetchLatestInspections(periodParam),
          ]);

        setData({
          partTypes,
          temporalEvolution,
          totalizingCards,
          latestInspections,
        });
      } catch (error) {
        setError("Erro ao carregar dados da dashboard");
        console.error("Dashboard data loading error:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchPartTypes, fetchTemporalEvolution, fetchTotalizingCards, fetchLatestInspections],
  );

  const refetch = useCallback(
    (periodParam?: string) => {
      loadDashboardData(periodParam);
    },
    [loadDashboardData],
  );

  useEffect(() => {
    loadDashboardData(period);
  }, [loadDashboardData, period]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
