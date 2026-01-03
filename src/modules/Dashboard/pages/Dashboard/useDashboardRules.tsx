import { useBreadcrumbContext } from "@/shared/contexts/Layout/Breadcrumb";
import { firstDayOfMonth, lastDayOfMonth } from "@/shared/utils/date/dayjs";
import { usePartInspectionStatusDropdown } from "@shared/hooks/services/Admin/Dropdown/usePartInspectionStatusDropdown";
import { IDashboardParams, useDashboard } from "@shared/hooks/services/Dashboard/useDashboard";
import { useDeviceDetection } from "@shared/hooks/useDeviceDetection";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Tipos para os dados da dashboard
export interface DashboardData {
  totalInspecoes: number;
  inspecoesAprovadas: number;
  inspecoesReprovadas: number;
  taxaAprovacao: number;
  porStatus: {
    labels: string[];
    data: number[];
  };
  evolucaoTemporal: {
    labels: string[];
    aprovadas: number[];
    reprovadas: number[];
    emAnalise: number[];
    pendentes: number[];
  };
  porTipo: {
    labels: string[];
    data: number[];
  };
  comparativoAprovacoes: {
    labels: string[];
    aprovadas: number[];
    comRestricao: number[];
    reprovadas: number[];
  };
  ultimasInspecoes: Array<{
    id: string;
    reportNumber: string;
    reportStartDate: string;
    customer: { fantasyName: string };
    partType: { name: string };
    inspectionStatus: { description: string };
    inspectorUser: { name: string };
  }>;
}

// Cores para os gráficos
export const chartColors = {
  aprovado: "rgba(75, 192, 75, 0.8)", // Verde
  reprovado: "rgba(220, 53, 69, 0.8)", // Vermelho (helper)
  emAnalise: "rgba(54, 162, 235, 0.8)", // Azul
  pendente: "rgba(255, 206, 86, 0.8)", // Amarelo
  comRestricao: "rgba(255, 193, 7, 0.8)", // Laranja (warning)
  tipos: [
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
  ],
};

export function useDashboardRules() {
  const { isSmartphone } = useDeviceDetection();

  const { data: dashboardApiData, loading, refetch, params, setParams } = useDashboard();
  const { result: statusOptions } = usePartInspectionStatusDropdown();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { setPageBreadcrumb } = useBreadcrumbContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchParams = useCallback(
    (params: IDashboardParams) => {
      setSearchParams({
        q: window.btoa(JSON.stringify(params)),
      });

      setParams(params);
    },
    [setSearchParams, setParams],
  );

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
  }, [setPageBreadcrumb]);

  // Função para processar os dados das inspeções
  const processInspectionData = useCallback((): DashboardData => {
    if (
      !dashboardApiData ||
      !dashboardApiData.temporalEvolution ||
      dashboardApiData.temporalEvolution.length === 0
    ) {
      return {
        totalInspecoes: 0,
        inspecoesAprovadas: 0,
        inspecoesReprovadas: 0,
        taxaAprovacao: 0,
        porStatus: {
          labels: ["Aprovadas", "Reprovadas", "Em Análise", "Pendentes"],
          data: [0, 0, 0, 0],
        },
        evolucaoTemporal: {
          labels: Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return format(date, "MMM/yy", { locale: ptBR });
          }).reverse(),
          aprovadas: Array(12).fill(0),
          reprovadas: Array(12).fill(0),
          emAnalise: Array(12).fill(0),
          pendentes: Array(12).fill(0),
        },
        porTipo: {
          labels: [],
          data: [],
        },
        comparativoAprovacoes: {
          labels: Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return format(date, "MMM/yy", { locale: ptBR });
          }).reverse(),
          aprovadas: Array(12).fill(0),
          comRestricao: Array(12).fill(0),
          reprovadas: Array(12).fill(0),
        },
        ultimasInspecoes: [],
      };
    }

    // Extrair dados dos cards totalizadores
    const totalCard = dashboardApiData.totalizingCards.find((card) => card.title.includes("Total"));
    const approvedCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Inspeções Aprovadas",
    );
    const withRestrictionCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Com Restrição",
    );
    const inAnalysisCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Em Análise",
    );
    const nonConformingCard = dashboardApiData.totalizingCards.find(
      (card) => card.title === "Não Conforme",
    );

    const totalInspecoes = totalCard?.value || 0;
    const aprovadas = approvedCard?.value || 0;
    const comRestricao = withRestrictionCard?.value || 0;
    const emAnalise = inAnalysisCard?.value || 0;
    const naoConforme = nonConformingCard?.value || 0;

    // Para compatibilidade com os gráficos existentes
    const reprovadas = naoConforme;

    // Dados por status para gráfico de pizza usando os status da API
    const statusLabels = ["Aprovadas", "Com Restrição", "Em Análise", "Não Conforme"];
    const statusData = [aprovadas, comRestricao, emAnalise, naoConforme];

    // Dados por tipo de inspeção (usando dados de partTypes)
    const tiposInspecao = dashboardApiData.partTypes?.map((pt) => pt.partTypeName) || [];
    const dadosPorTipo = dashboardApiData.partTypes?.map((pt) => pt.amount) || [];

    // Dados da evolução temporal
    const evolutionLabels = dashboardApiData.temporalEvolution.map((te) =>
      format(new Date(te.year, te.month - 1), "MMM/yy", { locale: ptBR }),
    );
    // Usar os valores corretos dos totalizingCards para o gráfico comparativo
    const approvedByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use apenas o campo "aprovado" (não total_aprovado)
      if (te.aprovado > 0) {
        return te.aprovado;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (aprovadas > 0 && index === arr.length - 1) {
        return aprovadas;
      }
      return 0;
    });

    const withRestrictionByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use-os
      if (te.com_restricao > 0) {
        return te.com_restricao;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (comRestricao > 0 && index === arr.length - 1) {
        return comRestricao;
      }
      return 0;
    });

    const rejectedByMonth = dashboardApiData.temporalEvolution.map((te, index, arr) => {
      // Se o temporal evolution tem dados válidos, use-os
      if (te.nao_conforme > 0) {
        return te.nao_conforme;
      }
      // Caso contrário, coloque o valor total no mês mais recente (último item)
      if (naoConforme > 0 && index === arr.length - 1) {
        return naoConforme;
      }
      return 0;
    });
    const inAnalysisByMonth = dashboardApiData.temporalEvolution.map((te) => te.em_analise);
    const pendingByMonth = dashboardApiData.temporalEvolution.map((te) => te.com_restricao);

    const comparativoData = {
      labels: evolutionLabels,
      aprovadas: approvedByMonth,
      comRestricao: withRestrictionByMonth,
      reprovadas: rejectedByMonth,
    };

    return {
      totalInspecoes,
      inspecoesAprovadas: aprovadas,
      inspecoesReprovadas: reprovadas,
      taxaAprovacao: approvedCard?.percentage || 0,
      porStatus: {
        labels: statusLabels,
        data: statusData,
      },
      evolucaoTemporal: {
        labels: evolutionLabels,
        aprovadas: approvedByMonth,
        reprovadas: rejectedByMonth,
        emAnalise: inAnalysisByMonth,
        pendentes: pendingByMonth,
      },
      porTipo: {
        labels: tiposInspecao,
        data: dadosPorTipo,
      },
      comparativoAprovacoes: comparativoData,
      ultimasInspecoes: dashboardApiData?.latestInspections || [],
    };
  }, [dashboardApiData, statusOptions]);

  // Atualizar dados processados quando API data mudar
  useEffect(() => {
    if (dashboardApiData) {
      const data = processInspectionData();
      setDashboardData(data);
      setLastUpdated(new Date());
    }
  }, [dashboardApiData, processInspectionData]);

  // Auto-refresh a cada 5 minutos
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoRefreshEnabled && params) {
      intervalId = setInterval(
        () => {
          refetch(params);
        },
        5 * 60 * 1000,
      ); // 5 minutos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, refetch, params]);

  // Configurações dos gráficos
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const areaChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#000000",
          font: {
            size: isSmartphone ? 10 : 12,
          },
        },
      },
    },
  };

  // Preparar dados para os gráficos
  const pieChartData = dashboardData
    ? {
        labels: dashboardData.porStatus.labels,
        datasets: [
          {
            data: dashboardData.porStatus.data,
            backgroundColor: [
              chartColors.aprovado,
              chartColors.comRestricao,
              chartColors.emAnalise,
              chartColors.reprovado,
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const barChartData =
    dashboardData && dashboardData.porTipo.labels.length > 0
      ? {
          labels: dashboardData.porTipo.labels,
          datasets: [
            {
              label: "Quantidade",
              data: dashboardData.porTipo.data,
              backgroundColor: chartColors.tipos,
              borderWidth: 1,
            },
          ],
        }
      : null;

  const areaChartData = dashboardData
    ? {
        labels: dashboardData.comparativoAprovacoes.labels,
        datasets: [
          {
            fill: true,
            label: "Aprovadas",
            data: dashboardData.comparativoAprovacoes.aprovadas,
            borderColor: chartColors.aprovado,
            backgroundColor: "rgba(75, 192, 75, 0.2)",
          },
          {
            fill: true,
            label: "Com Restrição",
            data: dashboardData.comparativoAprovacoes.comRestricao,
            borderColor: chartColors.comRestricao,
            backgroundColor: "rgba(255, 193, 7, 0.2)",
          },
          {
            fill: true,
            label: "Não Conforme",
            data: dashboardData.comparativoAprovacoes.reprovadas,
            borderColor: chartColors.reprovado,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      }
    : null;

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "success"; // Verde
      case "Com restrição":
        return "helper"; // Vermelho
      case "Em análise":
        return "brand-secondary-pure"; // Azul
      case "Não conforme":
        return "warning"; // Laranja
      default:
        return "default"; // Cinza para outros casos
    }
  };

  // Handler para mudança de auto-refresh
  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefreshEnabled(enabled);
  };

  return {
    // Estados
    dashboardData,
    dashboardApiData,
    loading,
    currentPage,
    autoRefreshEnabled,
    lastUpdated,
    isSmartphone,
    params,

    // Configurações dos gráficos
    pieChartOptions,
    barChartOptions,
    areaChartOptions,

    // Dados dos gráficos
    pieChartData,
    barChartData,
    areaChartData,

    // Funções
    getStatusColor,
    handleAutoRefreshToggle,
    setCurrentPage,
    handleSearchParams,
  };
}
