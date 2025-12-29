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

export function useInspections() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IInspection> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchingBy,
        search: params?.search,
        records: params?.records,
        page: params?.page,
        order: "reportStartDate:DESC",
        inspectionStatusId: params?.inspectionStatusId,
        status: params?.status,
      });

      const { data } = await get<IInspection>("/operational/parts-inspection", queryParams);

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
    }
  }, []);

  function refetch() {
    params && fetchData(params);
  }

  useEffect(() => {
    params && fetchData(params);
  }, [params, fetchData]);

  return { result, params, refetch, setParams };
}
