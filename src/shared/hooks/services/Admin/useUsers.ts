/* import { URL_LIST_USUA } from "@shared/constants/urls"; */
import { fakeRequest, get } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IUsers {
  id: string;
  name: string;
  socialName: string;
  email: string;
  isActive: boolean;
  profileId: string;
  profileName: string;
  profileAcronym: string;
  photoUrl: string;
  signature?: string;
  password?: string;
  birthDate?: string;
  customersIds?: string[];
  created_at: string;
  updated_at: string;
}

export function useUsers() {
  const [params, setParams] = useState<Record<string, any> | null>(null);

  const [result, setResult] = useState<IApiResponse<IUsers> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchingBy: params?.searchingBy,
        search: params?.search,
        records: params?.records,
        page: params?.page,
        order: params.order,
        status: params?.status,
      });

      const { data } = await get<IUsers>("/parametrizations/profile-management/users", queryParams);

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

  return { result, params, refetch, setParams, setResult };
}
