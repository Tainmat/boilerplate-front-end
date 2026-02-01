import { useMemo } from "react";

import { ITotalizingCardData } from "@/shared/hooks/services/Dashboard/useTotalizingCards";
import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";

interface Props {
  data: ITotalizingCardData | null;
}

export interface IDashboardTotalizingCard {
  title: string;
  value: number;
  percentage?: number;
  icon: string;
  status: "success" | "helper" | "warning" | "light" | "primary" | "neutral";
}

export function useTotalizingCardRules({ data }: Props) {
  const { isSmartphone } = useDeviceDetection();

  const processData: IDashboardTotalizingCard[] = useMemo(
    () => [
      {
        title: "Total de Inspeções",
        value: data?.total_inspecoes || 0,
        icon: "assignment",
        status: "primary",
      },
      {
        title: "Inspeções Aprovadas",
        value: data?.aprovado?.amount || 0,
        percentage: data?.aprovado?.percentage || 0,
        icon: "check_circle",
        status: "success",
      },
      {
        title: "Não Conforme",
        value: data?.nao_conforme?.amount || 0,
        percentage: data?.nao_conforme?.percentage || 0,
        icon: "cancel",
        status: "warning",
      },
      {
        title: "Com Restrição",
        value: data?.com_restricao?.amount || 0,
        percentage: data?.com_restricao?.percentage || 0,
        icon: "warning",
        status: "helper",
      },
      {
        title: "Em Análise",
        value: data?.em_analise?.amount || 0,
        percentage: data?.em_analise?.percentage || 0,
        icon: "pending_actions",
        status: "neutral",
      },
      {
        title: "Taxa de Aprovação",
        value: Math.round(data?.taxa_aprovacao || 0),
        icon: "trending_up",
        status: (data?.taxa_aprovacao || 0) > 70 ? "success" : "helper",
      },
    ],
    [data],
  );

  return {
    processData,
    isSmartphone,
  };
}
