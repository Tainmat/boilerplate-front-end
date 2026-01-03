import { IInspectionPartType } from "@/shared/hooks/services/Dashboard/useInspectionPartType";
import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";
import { useMemo } from "react";

interface Props {
  data: IInspectionPartType[] | null;
}

const chartColors = [
  "rgba(75, 192, 192, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 99, 132, 0.8)",
];

export function useInspectionByTypeRules({ data }: Props) {
  const { isSmartphone } = useDeviceDetection();

  const barChartOptions = useMemo(
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
          display: false,
        },
      },
    }),
    [isSmartphone],
  );

  const barChartData = useMemo(() => {
    if (!data || data.length === 0) return null;

    return {
      labels: data.map((item) => item.partTypeName),
      datasets: [
        {
          label: "Quantidade",
          data: data.map((item) => item.amount),
          backgroundColor: chartColors,
          borderWidth: 1,
        },
      ],
    };
  }, [data]);

  return {
    barChartOptions,
    barChartData,
  };
}
