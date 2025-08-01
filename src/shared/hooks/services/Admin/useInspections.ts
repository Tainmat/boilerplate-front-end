import { get, fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IInspection {
  id: string;
  reportNumber: string;
  revisionNumber: string;
  reportStartDate: string;
  reportEndDate: string;
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

// Dados de exemplo (removidos quando a API estiver funcionando)
export const inspections: IInspection[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    reportNumber: "REL-001-2024",
    revisionNumber: "REV-01",
    reportStartDate: "2024-01-15",
    reportEndDate: "2024-01-16",
    customer: {
      id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      corporateName: "Cliente ABC S.A.",
      fantasyName: "Cliente ABC",
    },
    inspectorUser: {
      id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
      name: "João Silva",
    },
    partType: {
      id: "c3d4e5f6-g7h8-9012-cdef-g34567890123",
      name: "Filtro de Óleo",
    },
    inspectionStatus: {
      id: "d4e5f6g7-h8i9-0123-defg-h45678901234",
      description: "Aprovado",
    },
  },
  {
    id: "g58bd21c-69dd-5483-b678-1f13c3d4e480",
    reportNumber: "REL-002-2024",
    revisionNumber: "REV-00",
    reportStartDate: "2024-01-20",
    reportEndDate: "2024-01-21",
    customer: {
      id: "b2c3d4e5-f6g7-8901-bcde-f23456789013",
      corporateName: "Industrial XYZ Ltda.",
      fantasyName: "XYZ Industrial",
    },
    inspectorUser: {
      id: "c3d4e5f6-g7h8-9012-cdef-g34567890124",
      name: "Maria Santos",
    },
    partType: {
      id: "d4e5f6g7-h8i9-0123-defg-h45678901235",
      name: "Bomba Centrífuga",
    },
    inspectionStatus: {
      id: "e5f6g7h8-i9j0-1234-efgh-i56789012346",
      description: "Em Análise",
    },
  },
];

export function useInspections() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IInspection> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchIn,
        search: params?.value,
        records: params?.items,
        page: params?.page,
        order: params?.order,
        status: params?.status,
      });

      const { data } = await get<IInspection>("/operational/parts-inspection", queryParams);

      if (data.data.length > 0) {
        setResult({
          data: data.data,
          page: data.page,
          total: data.records,
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