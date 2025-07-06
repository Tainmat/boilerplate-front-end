/* import { URL_LIST_USUA } from "@shared/constants/urls"; */
import { fakeRequest, get } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IUsers {
  idUsuario: number;
  uuidUsuario: string;
  nomeUsuario: string;
  nomeSocialUsuario?: string;
  emailUsuario: string;
  dataNascimento?: string;
  idPerfil?: string;
  dsPerfil?: string;
  dataCadastroUsuario: string;
  inStatusCadastroUsuario: boolean;
  dsStatusCadastroUsuario: string;
}

export const usuarios = [
  {
    idUsuario: 1,
    uuidUsuario: "usr-1111-aaaa",
    nomeUsuario: "Thomaz Fernandes",
    nomeSocialUsuario: "Tom Fernandes",
    emailUsuario: "thomaz.fernandes@exemplo.com",
    dataNascimento: "1990-05-15",
    idPerfil: "perf-1111",
    dsPerfil: "Administrador",
    dataCadastroUsuario: "2024-06-19T10:30:00Z",
    inStatusCadastroUsuario: true,
    dsStatusCadastroUsuario: "Ativo",
  },
  {
    idUsuario: 2,
    uuidUsuario: "usr-2222-bbbb",
    nomeUsuario: "Ana Martins",
    nomeSocialUsuario: "",
    emailUsuario: "ana.martins@exemplo.com",
    dataNascimento: "1985-10-22",
    idPerfil: "perf-2222",
    dsPerfil: "Inspetor",
    dataCadastroUsuario: "2024-05-22T14:15:00Z",
    inStatusCadastroUsuario: false,
    dsStatusCadastroUsuario: "Inativo",
  },
];

export function useUsers() {
  const [params, setParams] = useState<Record<string, any> | null>(null);

  const [result, setResult] = useState<IApiResponse<IUsers> | null>(null);

  const fakeGetUsuarios = async (queryParams: any) => {
    const { searchIn, value } = queryParams;

    let filtered = [...usuarios];

    if (searchIn && value) {
      const searchValue = value.toLowerCase();
      filtered = filtered.filter((usuario) => {
        const fieldValue = usuario[searchIn as keyof typeof usuario];
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchValue);
        }
        return String(fieldValue).toLowerCase().includes(searchValue);
      });
    }

    // Simulando paginação (se quiser)
    const page = queryParams.page || 1;
    const itemsPerPage = queryParams.items || 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginated = filtered.slice(startIndex, endIndex);

    return fakeRequest(1000, {
      items: paginated,
      current_page: page,
      total_items: filtered.length,
    });
  };

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
        inStatusCadastroUsuario: params?.status,
      });

      /* const { data } = await get<IUsers>(URL_LIST_USUA, queryParams); */

      let { data } = await fakeGetUsuarios(queryParams);

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

  return { result, params, refetch, setParams, setResult };
}
