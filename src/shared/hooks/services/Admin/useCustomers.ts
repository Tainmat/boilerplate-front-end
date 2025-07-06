/* import { URL_PROC_LIST_CLIE } from "@shared/constants/urls"; */
import { get, fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface ICustomer {
  idCliente: number;
  uuidCliente: string;
  tipoPessoaCliente: string;
  dsTipoPessoaCliente: string;
  numeroDocumentoCliente: string;
  numeroCepCliente: string;
  dsLogradouroCliente: string;
  numeroLogradouroCliente: string;
  dsComplementoCliente: string;
  dsBairroCliente: string;
  dsMunicipioCliente: string;
  dsUfCliente: string;
  nomeRazaoSocialCliente: string;
  numeroTelefoneCliente: string;
  dsEmailCliente: string;
  descricaoObservacoesCliente: string;
  dataCadastroCliente: string;
  inStatusCadastroCliente: boolean;
  dsStatusCadastroCliente: string;
}

export const customers: ICustomer[] = [
  {
    idCliente: 1,
    uuidCliente: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    tipoPessoaCliente: "J",
    dsTipoPessoaCliente: "Jurídica",
    numeroDocumentoCliente: "12.345.678/0001-90",
    numeroCepCliente: "01234-567",
    dsLogradouroCliente: "Rua das Flores",
    numeroLogradouroCliente: "123",
    dsComplementoCliente: "Apto 101",
    dsBairroCliente: "Centro",
    dsMunicipioCliente: "São Paulo",
    dsUfCliente: "SP",
    nomeRazaoSocialCliente: "Silva Tecnologia Ltda",
    numeroTelefoneCliente: "(11) 91234-5678",
    dsEmailCliente: "joao.silva@email.com",
    descricaoObservacoesCliente: "Cliente ativo e pontual.",
    dataCadastroCliente: "2024-01-15",
    inStatusCadastroCliente: true,
    dsStatusCadastroCliente: "Ativo",
  },
  {
    idCliente: 2,
    uuidCliente: "b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    tipoPessoaCliente: "J",
    dsTipoPessoaCliente: "Jurídica",
    numeroDocumentoCliente: "12.345.678/0001-99",
    numeroCepCliente: "12345-678",
    dsLogradouroCliente: "Av. Paulista",
    numeroLogradouroCliente: "1000",
    dsComplementoCliente: "Sala 501",
    dsBairroCliente: "Bela Vista",
    dsMunicipioCliente: "São Paulo",
    dsUfCliente: "SP",
    nomeRazaoSocialCliente: "Empresa XPTO Ltda",
    numeroTelefoneCliente: "(21) 99876-5432",
    dsEmailCliente: "contato@xpto.com.br",
    descricaoObservacoesCliente: "Solicitou atualização cadastral.",
    dataCadastroCliente: "2023-12-01",
    inStatusCadastroCliente: false,
    dsStatusCadastroCliente: "Inativo",
  },
  {
    idCliente: 3,
    uuidCliente: "c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    tipoPessoaCliente: "J",
    dsTipoPessoaCliente: "Jurídica",
    numeroDocumentoCliente: "98.765.432/0001-10",
    numeroCepCliente: "54321-987",
    dsLogradouroCliente: "Rua das Artes",
    numeroLogradouroCliente: "456",
    dsComplementoCliente: "",
    dsBairroCliente: "Jardim América",
    dsMunicipioCliente: "Belo Horizonte",
    dsUfCliente: "MG",
    nomeRazaoSocialCliente: "Oliveira Artes Ltda",
    numeroTelefoneCliente: "(31) 91122-3344",
    dsEmailCliente: "maria.oliveira@email.com",
    descricaoObservacoesCliente: "Cliente em análise.",
    dataCadastroCliente: "2024-03-22",
    inStatusCadastroCliente: true,
    dsStatusCadastroCliente: "Ativo",
  },
  {
    idCliente: 4,
    uuidCliente: "d4e5f6a7-b8c9-1021-def0-4567890123de",
    tipoPessoaCliente: "J",
    dsTipoPessoaCliente: "Jurídica",
    numeroDocumentoCliente: "98.765.432/0001-11",
    numeroCepCliente: "87654-321",
    dsLogradouroCliente: "Rua da Tecnologia",
    numeroLogradouroCliente: "789",
    dsComplementoCliente: "Bloco B",
    dsBairroCliente: "Tecnópolis",
    dsMunicipioCliente: "Curitiba",
    dsUfCliente: "PR",
    nomeRazaoSocialCliente: "Tech Solutions S/A",
    numeroTelefoneCliente: "(41) 93456-7890",
    dsEmailCliente: "suporte@techsol.com",
    descricaoObservacoesCliente: "Aguardando aprovação financeira.",
    dataCadastroCliente: "2024-05-10",
    inStatusCadastroCliente: false,
    dsStatusCadastroCliente: "Inativo",
  },
  {
    idCliente: 5,
    uuidCliente: "e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    tipoPessoaCliente: "J",
    dsTipoPessoaCliente: "Jurídica",
    numeroDocumentoCliente: "32.165.498/0001-20",
    numeroCepCliente: "65432-198",
    dsLogradouroCliente: "Av. do Design",
    numeroLogradouroCliente: "321",
    dsComplementoCliente: "Casa",
    dsBairroCliente: "Jardim Europa",
    dsMunicipioCliente: "Porto Alegre",
    dsUfCliente: "RS",
    nomeRazaoSocialCliente: "Pereira Design Ltda",
    numeroTelefoneCliente: "(51) 92345-6789",
    dsEmailCliente: "carlos.pereira@email.com",
    descricaoObservacoesCliente: "Novo cliente.",
    dataCadastroCliente: "2024-06-05",
    inStatusCadastroCliente: true,
    dsStatusCadastroCliente: "Ativo",
  },
];

export function useCustomers() {
  const [params, setParams] = useState<Record<string, any> | null>(null);

  const [result, setResult] = useState<IApiResponse<ICustomer> | null>(null);

  const fakeGetUsuarios = async (queryParams: any) => {
    const { searchIn, value } = queryParams;

    let filtered = [...customers];

    if (searchIn && value) {
      const searchValue = value.toLowerCase();
      filtered = filtered.filter((customer) => {
        const fieldValue = customer[searchIn as keyof typeof customer];
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
        inStatusCadastroCliente: params?.status,
      });

      /* const { data } = await get<IClient>(URL_PROC_LIST_CLIE, queryParams); */
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

  return { result, params, refetch, setParams };
}
