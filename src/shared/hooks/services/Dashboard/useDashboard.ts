import { removeEmptyEntries } from "@/shared/utils/generic";
import { get } from "@shared/services/api/api.service";
import { useCallback, useEffect, useState } from "react";

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
  com_restricao: number;
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
  com_restricao: {
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

export interface IDashboardParams {
  initialReportStartDate: string;
  finalReportStartDate: string;
  customerId: string;
}

export function useDashboard() {
  const [params, setParams] = useState<IDashboardParams | null>(null);
  const [data, setData] = useState<IDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartTypes = useCallback(
    async (params: IDashboardParams): Promise<IDashboardPartType[]> => {
      try {
        const payload = removeEmptyEntries(params);
        const { data } = await get<IDashboardPartType[]>(
          "/operational/parts-inspection/dashboard/inspection-part-types",
          payload,
        );
        return data.data || [];
      } catch (error) {
        return [];
      }
    },
    [],
  );

  const fetchTemporalEvolution = useCallback(
    async (params: IDashboardParams): Promise<IDashboardTemporalEvolution[]> => {
      try {
        const payload = removeEmptyEntries(params);
        const { data } = await get<IDashboardTemporalEvolution[]>(
          "/operational/parts-inspection/dashboard/temporal-evolution",
          payload,
        );
        return data.data || [];
      } catch (error) {
        return [];
      }
    },
    [],
  );

  const fetchTotalizingCards = useCallback(
    async (params: IDashboardParams): Promise<IDashboardTotalizingCard[]> => {
      try {
        const payload = removeEmptyEntries(params);
        const { data } = await get<IApiTotalizingCardsResponse>(
          "/operational/parts-inspection/dashboard/totalizing-cards",
          payload,
        );

        // Mapear o retorno da API para cards amigáveis
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

        return cards;
      } catch (error) {
        return [];
      }
    },
    [],
  );

  const fetchLatestInspections = useCallback(
    async (params: IDashboardParams): Promise<IDashboardInspection[]> => {
      try {
        const filters = removeEmptyEntries(params);

        const payload = {
          ...filters,
          records: 10,
          page: 1,
          order: "reportStartDate:DESC",
          status: "active",
        };
        const { data } = await get<{ data: IDashboardInspection[] }>(
          "/operational/parts-inspection",
          payload,
        );
        return data.data || [];
      } catch (error) {
        return [];
      }
    },
    [],
  );

  const loadDashboardData = useCallback(
    async (params: IDashboardParams) => {
      setLoading(true);
      setError(null);

      try {
        const [partTypes, temporalEvolution, totalizingCards, latestInspections] =
          await Promise.all([
            fetchPartTypes(params),
            fetchTemporalEvolution(params),
            fetchTotalizingCards(params),
            fetchLatestInspections(params),
          ]);

        setData({
          partTypes,
          temporalEvolution,
          totalizingCards,
          latestInspections,
        });
      } catch (error) {
        setError("Erro ao carregar dados da dashboard");
      } finally {
        setLoading(false);
      }
    },
    [fetchPartTypes, fetchTemporalEvolution, fetchTotalizingCards, fetchLatestInspections],
  );

  const refetch = useCallback(
    (params: IDashboardParams) => {
      loadDashboardData(params);
    },
    [loadDashboardData],
  );

  useEffect(() => {
    params && loadDashboardData(params);
  }, [loadDashboardData, params]);

  return {
    data,
    loading,
    error,
    refetch,
    setParams,
    params,
  };
}
