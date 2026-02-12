import { get } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IInspection {
  id: string;
  reportNumber: string;
  revisionNumber: string;
  reportStartDate: string;
  reportEndDate: string;
  isActive: boolean;
  componentId: string;
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
  createdAt: string;
  updatedAt: string;
}

export function useInspections() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IInspection> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);
      setLoading(true);
      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchingBy,
        search: params?.search,
        records: params?.records,
        page: params?.page,
        order: "reportStartDate:DESC",
        inspectionStatusId: params?.inspectionStatusId,
        status: params?.status,
        initialReportStartDate: params?.initialReportStartDate,
        finalReportStartDate: params?.finalReportStartDate,
        customerId: params?.customerId,
      });

      const { data } = await get("/operational/parts-inspection", queryParams);

      if (data.data.length > 0) {
        setResult({
          data: data.data,
          page: data.page,
          total: data.total,
        });
      } else {
        setResult({
          data: [],
          page: 0,
          total: 0,
        });
      }
    } catch {
      setResult({
        data: [],
        page: 0,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  function refetch() {
    if (params) {
      fetchData(params);
    }
  }

  useEffect(() => {
    if (params) {
      fetchData(params);
    }
  }, [params, fetchData]);

  return { result, params, refetch, setParams, loading };
}
