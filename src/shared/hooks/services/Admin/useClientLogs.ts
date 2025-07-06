import { fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IClientLogs {
  idLogCliente: number;
  uuidLogCliente: string;
  uuidCliente: string;
  nomeRazaoSocialCliente: string;
  dsAcaoLogCliente: string;
  dsIpLogCliente: string;
  dataLogCliente: string;
}

export function useClientLogs() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IClientLogs> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchIn: params?.searchIn,
        value: params?.value,
        items: params?.items,
        page: params?.page,
        sort: params?.sort,
        order: params.order,
        uuidCliente: params?.uuidCliente,
      });

      // Mock data for logs
      const mockLogs = [
        {
          idLogCliente: 1,
          uuidLogCliente: "log-cli-1111",
          uuidCliente: params.uuidCliente,
          nomeRazaoSocialCliente: "Silva Tecnologia Ltda",
          dsAcaoLogCliente: "Criação de cliente",
          dsIpLogCliente: "192.168.1.1",
          dataLogCliente: "2024-01-15T10:30:00Z",
        },
        {
          idLogCliente: 2,
          uuidLogCliente: "log-cli-2222",
          uuidCliente: params.uuidCliente,
          nomeRazaoSocialCliente: "Silva Tecnologia Ltda",
          dsAcaoLogCliente: "Atualização de dados",
          dsIpLogCliente: "192.168.1.1",
          dataLogCliente: "2024-02-20T14:45:00Z",
        }
      ];

      const { data } = await fakeRequest(1000, {
        items: mockLogs,
        current_page: 1,
        total_items: mockLogs.length,
      });

      if (data) {
        setResult({
          data: data.items,
          page: data.current_page,
          total: data.total_items,
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