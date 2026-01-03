import { IDashboardParams } from "@/shared/hooks/services/Dashboard/useDashboard";
import { useTotalizingCards } from "@/shared/hooks/services/Dashboard/useTotalizingCards";
import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";
import { useEffect } from "react";

interface Props {
  params: IDashboardParams | null;
}

export function useTotalizingCardRules({ params }: Props) {
  const { isSmartphone } = useDeviceDetection();

  const { data, loading, setParams } = useTotalizingCards();

  useEffect(() => {
    setParams(params);
  }, [params]);

  return {
    data,
    loading,
    isSmartphone,
  };
}
