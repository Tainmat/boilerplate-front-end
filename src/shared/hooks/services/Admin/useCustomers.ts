/* import { URL_PROC_LIST_CLIE } from "@shared/constants/urls"; */
import { get, fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { da } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";

export interface ICustomer {
  id: string;
  corporateName: string;
  fantasyName: string;
  cnpj: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export function useCustomers() {
  const [params, setParams] = useState<Record<string, any> | null>(null);

  const [result, setResult] = useState<IApiResponse<ICustomer> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchingBy,
        search: params?.search,
        records: params?.records,
        page: params?.page,
        order: params?.order,
        status: params?.status,
      });

      const { data } = await get<ICustomer>("parametrizations/customers", queryParams);

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
