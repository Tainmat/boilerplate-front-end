import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

import { ITemporalEvolutionData } from "@/shared/hooks/services/Dashboard/useTemporalEvolution";
import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";

interface Props {
  data: ITemporalEvolutionData[] | null;
}

// Cores para os status
const chartColors = {
  aprovado: "rgba(75, 192, 75, 0.8)",
  comRestricao: "rgba(255, 193, 7, 0.8)",
  naoConforme: "rgba(220, 53, 69, 0.8)",
};

export function useTemporalEvolutionChartRules({ data }: Props) {
  const { isSmartphone } = useDeviceDetection();

  const areaChartOptions = useMemo(
    () => ({
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
    }),
    [isSmartphone],
  );

  const areaChartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    const labels = data.map((item) =>
      format(new Date(item.year, item.month - 1), "MMM/yy", { locale: ptBR }),
    );

    const aprovadas = data.map((item) => item.aprovado);
    const comRestricao = data.map((item) => item.com_restricao);
    const naoConforme = data.map((item) => item.nao_conforme);

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: "Aprovadas",
          data: aprovadas,
          borderColor: chartColors.aprovado,
          backgroundColor: "rgba(75, 192, 75, 0.2)",
        },
        {
          fill: true,
          label: "Com Restrição",
          data: comRestricao,
          borderColor: chartColors.comRestricao,
          backgroundColor: "rgba(255, 193, 7, 0.2)",
        },
        {
          fill: true,
          label: "Não Conforme",
          data: naoConforme,
          borderColor: chartColors.naoConforme,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    };
  }, [data]);

  return {
    areaChartOptions,
    areaChartData,
  };
}
