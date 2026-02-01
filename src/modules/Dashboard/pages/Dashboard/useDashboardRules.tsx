import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { useInspectionPartType } from "@/shared/hooks/services/Dashboard/useInspectionPartType";
import { useTemporalEvolution } from "@/shared/hooks/services/Dashboard/useTemporalEvolution";
import { useTotalizingCards } from "@/shared/hooks/services/Dashboard/useTotalizingCards";
import { useAuthRoles } from "@/shared/hooks/services/Rules/Auth/useRoles";
import { firstDayOfMonth, lastDayOfMonth } from "@/shared/utils/date/dayjs";

export interface IDashboardParams {
  initialReportStartDate: string;
  finalReportStartDate: string;
  customerId: string;
}

export function useDashboardRules() {
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const latestInspectionsRefetchRef = useRef<(() => void) | null>(null);
  const { isCustomer } = useAuthRoles();

  // Hooks dos componentes individuais
  const {
    params,
    data: totalizingCardsData,
    loading: totalizingCardsLoading,
    setParams: setTotalizingCardsParams,
    refetch: refetchTotalizingCards,
  } = useTotalizingCards();

  const {
    data: inspectionPartTypeData,
    loading: inspectionPartTypeLoading,
    setParams: setInspectionPartTypeParams,
    refetch: refetchInspectionByType,
  } = useInspectionPartType();

  const {
    data: temporalEvolutionData,
    loading: temporalEvolutionLoading,
    setParams: setTemporalEvolutionParams,
    refetch: refetchTemporalEvolution,
  } = useTemporalEvolution();

  const handleSearchParams = useCallback(
    (params: IDashboardParams) => {
      setSearchParams({
        q: window.btoa(JSON.stringify(params)),
      });

      setTotalizingCardsParams(params);
      setInspectionPartTypeParams(params);
      setTemporalEvolutionParams(params);
      setLastUpdated(new Date());
    },
    [
      setSearchParams,
      setTotalizingCardsParams,
      setInspectionPartTypeParams,
      setTemporalEvolutionParams,
    ],
  );

  const handleLatestInspectionsRefetchReady = useCallback((refetch: () => void) => {
    latestInspectionsRefetchRef.current = refetch;
  }, []);

  useLayoutEffect(() => {
    setPageBreadcrumb([{ text: "Página Inicial" }]);

    if (params === null) {
      let params;

      if (searchParams.get("q")) {
        params = JSON.parse(window.atob(String(searchParams.get("q"))));
      } else {
        params = {
          customerId: "",
          initialReportStartDate: firstDayOfMonth(),
          finalReportStartDate: lastDayOfMonth(),
        };
      }

      handleSearchParams(params);
    }
  }, [setPageBreadcrumb, handleSearchParams, params, searchParams]);

  // Auto-refresh a cada 5 minutos quando ativado
  useEffect(() => {
    if (!autoRefreshEnabled || !params) return;

    const intervalId = setInterval(
      () => {
        refetchTotalizingCards(params);
        refetchInspectionByType(params);
        refetchTemporalEvolution(params);
        latestInspectionsRefetchRef.current?.();
        setLastUpdated(new Date());
      },
      5 * 60 * 1000,
    ); // 5 minutos em milissegundos

    return () => clearInterval(intervalId);
  }, [
    autoRefreshEnabled,
    params,
    refetchTotalizingCards,
    refetchInspectionByType,
    refetchTemporalEvolution,
  ]);

  return {
    // Estados
    lastUpdated,
    params,
    autoRefreshEnabled,

    // Dados dos componentes (dados brutos)
    totalizingCards: {
      data: totalizingCardsData,
      loading: totalizingCardsLoading,
    },
    inspectionByType: {
      data: inspectionPartTypeData,
      loading: inspectionPartTypeLoading,
    },
    temporalEvolution: {
      data: temporalEvolutionData,
      loading: temporalEvolutionLoading,
    },

    // Funções
    handleSearchParams,
    setAutoRefreshEnabled,
    handleLatestInspectionsRefetchReady,
    isCustomer,
  };
}
