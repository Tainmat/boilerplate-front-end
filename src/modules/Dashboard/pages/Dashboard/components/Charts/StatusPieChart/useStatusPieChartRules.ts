import { ITotalizingCardData } from "@/shared/hooks/services/Dashboard/useTotalizingCards";
import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";
import { useMemo } from "react";

interface Props {
  data: ITotalizingCardData | null;
}

export interface IStatusPieChartData {
  labels: string[];
  data: number[];
  colors: string[];
}

// Cores para os status
const chartColors = {
  aprovado: "rgba(75, 192, 75, 0.8)", // Verde
  comRestricao: "rgba(255, 193, 7, 0.8)", // Amarelo/Laranja
  emAnalise: "rgba(54, 162, 235, 0.8)", // Azul
  naoConforme: "rgba(220, 53, 69, 0.8)", // Vermelho
};

export function useStatusPieChartRules({ data }: Props) {
  const { isSmartphone } = useDeviceDetection();

  const processedData: IStatusPieChartData | null = useMemo(() => {
    if (!data) return null;

    return {
      labels: ["Aprovadas", "Com Restrição", "Em Análise", "Não Conforme"],
      data: [
        data.aprovado?.amount || 0,
        data.com_restricao?.amount || 0,
        data.em_analise?.amount || 0,
        data.nao_conforme?.amount || 0,
      ],
      colors: [
        chartColors.aprovado,
        chartColors.comRestricao,
        chartColors.emAnalise,
        chartColors.naoConforme,
      ],
    };
  }, [data]);

  const pieChartOptions = useMemo(
    () => ({
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
    }),
    [isSmartphone],
  );

  const pieChartData = useMemo(() => {
    if (!processedData) return null;

    return {
      labels: processedData.labels,
      datasets: [
        {
          data: processedData.data,
          backgroundColor: processedData.colors,
          borderWidth: 1,
        },
      ],
    };
  }, [processedData]);

  return {
    processedData,
    pieChartOptions,
    pieChartData,
  };
}
