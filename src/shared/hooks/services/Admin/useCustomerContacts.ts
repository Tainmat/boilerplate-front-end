/* import { URL_PROC_LIST_CONT_CLIE } from "@shared/constants/urls"; */
import { get } from "@shared/services/api/api.service";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

import { IApiResponse } from "@/shared/services/api/api.service.interface";

export interface ICustomerContacts {
  customerId: string;
  id: string;
  name: string;
  email: string;
  mobile: string;
  phone: string;
  extension: string;
  isWhatsApp: boolean;
  receiveInspectionEmail: boolean;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export function useCustomerContacts() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<ICustomerContacts> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        customerId: params.customerId,
        searchingBy: params?.searchingBy,
        search: params?.search,
        records: params?.records,
        page: params?.page,
        order: params?.order,
        status: params?.status,
      });

      const { data } = await get(
        `${"parametrizations/customers"}/${queryParams.customerId}/contacts`,
        queryParams,
      );

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
    if (params) {
      fetchData(params);
    }
  }

  useEffect(() => {
    if (params) {
      fetchData(params);
    }
  }, [params, fetchData]);

  return { result, params, refetch, setParams };
}
