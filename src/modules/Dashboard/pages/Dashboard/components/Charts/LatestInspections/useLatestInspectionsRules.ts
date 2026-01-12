import { useInspections } from "@/shared/hooks/services/Admin/useInspections";

import { useDeviceDetection } from "@/shared/hooks/useDeviceDetection";
import { useEffect } from "react";
import { IDashboardParams } from "../../../useDashboardRules";

interface Props {
  params: IDashboardParams | null;
}

export function useLatestInspectionsRules({ params }: Props) {
  const { isSmartphone } = useDeviceDetection();
  const { setParams, result, refetch, loading } = useInspections();

  useEffect(() => {
    if (params) {
      setParams({
        ...params,
        records: 10,
        page: 1,
        order: "reportStartDate:DESC",
        status: "active",
      });
    }
  }, [params, setParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "success";
      case "Com restrição":
        return "helper";
      case "Em análise":
        return "brand-secondary-pure";
      case "Não conforme":
        return "warning";
      default:
        return "default";
    }
  };

  return {
    isSmartphone,
    getStatusColor,
    result,
    refetch,
    loading,
  };
}
