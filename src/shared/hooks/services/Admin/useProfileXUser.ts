/* import { URL_LIST_ASSO_PERF_USUA } from "@shared/constants/urls"; */
import { fakeRequest, get } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IProfileXUser {
  idUsuarioPerfil: number;
  uuidUsuario: string;
  nomeUsuario: string;
  uuidPerfil: string;
  nomePerfil: string;
  uuidUsuarioPerfil: string;
  dataCadastroUsuarioPerfil: string;
  inStatusCadastroUsuarioPerfil: boolean;
  dsStatusCadastroUsuarioPerfil: string;
}

export function useProfileXUser() {
  const [params, setParams] = useState<Record<string, any> | null>(null);

  const [result, setResult] = useState<IApiResponse<IProfileXUser> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchIn: "uuidUsuario",
        value: params.uuidUsuario,
        inAssociacaoUsuarioPerfil: true,
        items: params?.items,
        page: params?.page,
        sort: params?.sort,
        order: params.order,
        inStatusCadastroUsuarioPerfil: params?.status,
      });

      /* const { data } = await get<IProfileXUser>(URL_LIST_ASSO_PERF_USUA, queryParams); */

      const { data } = await fakeRequest(2000, queryParams);

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
