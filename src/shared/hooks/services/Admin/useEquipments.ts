/* import { URL_PROC_LIST_EQUIP } from "@shared/constants/urls"; */
import { get, fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IEquipment {
  idEquipamento: number;
  uuidEquipamento: string;
  idTipoPeca: number;
  uuidTipoPeca: string;
  nmTipoPeca: string;
  dsObservacao: string;
  ttPontoInspecao: number;
  nomeEquipamento: string;
  dataCadastroEquipamento: string;
  dataUltimaAtualizacao: string;
  inStatusCadastroEquipamento: boolean;
  dsStatusCadastroEquipamento: string;
  uuidCliente?: string;
  nomeCliente?: string;
}

export const equipments: IEquipment[] = [
  {
    idEquipamento: 1,
    uuidEquipamento: "eq-a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    idTipoPeca: 1,
    uuidTipoPeca: "tp-a1b2c3d4",
    nmTipoPeca: "Moenda",
    dsObservacao: "Equipamento principal para processamento de cana.",
    ttPontoInspecao: 5,
    nomeEquipamento: "Moenda Principal Linha 1",
    dataCadastroEquipamento: "2024-01-15",
    dataUltimaAtualizacao: "2024-06-20",
    inStatusCadastroEquipamento: true,
    dsStatusCadastroEquipamento: "Ativo",
    uuidCliente: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    nomeCliente: "João da Silva",
  },
  {
    idEquipamento: 2,
    uuidEquipamento: "eq-b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    idTipoPeca: 2,
    uuidTipoPeca: "tp-b2c3d4e5",
    nmTipoPeca: "Caldeira",
    dsObservacao: "Caldeira para geração de vapor do processo.",
    ttPontoInspecao: 8,
    nomeEquipamento: "Caldeira de Vapor Principal",
    dataCadastroEquipamento: "2023-12-01",
    dataUltimaAtualizacao: "2024-05-15",
    inStatusCadastroEquipamento: false,
    dsStatusCadastroEquipamento: "Inativo",
    uuidCliente: "b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    nomeCliente: "Empresa XPTO Ltda",
  },
  {
    idEquipamento: 3,
    uuidEquipamento: "eq-c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    idTipoPeca: 3,
    uuidTipoPeca: "tp-c3d4e5f6",
    nmTipoPeca: "Turbina",
    dsObservacao: "Turbina para geração de energia elétrica.",
    ttPontoInspecao: 6,
    nomeEquipamento: "Turbina Geradora 1",
    dataCadastroEquipamento: "2024-03-22",
    dataUltimaAtualizacao: "2024-04-10",
    inStatusCadastroEquipamento: true,
    dsStatusCadastroEquipamento: "Ativo",
    uuidCliente: "c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    nomeCliente: "Maria Oliveira",
  },
  {
    idEquipamento: 4,
    uuidEquipamento: "eq-d4e5f6a7-b8c9-1021-def0-4567890123de",
    idTipoPeca: 4,
    uuidTipoPeca: "tp-d4e5f6a7",
    nmTipoPeca: "Centrífuga",
    dsObservacao: "Centrífuga para separação de açúcar.",
    ttPontoInspecao: 4,
    nomeEquipamento: "Centrífuga Contínua A",
    dataCadastroEquipamento: "2024-05-10",
    dataUltimaAtualizacao: "2024-05-10",
    inStatusCadastroEquipamento: false,
    dsStatusCadastroEquipamento: "Inativo",
    uuidCliente: "d4e5f6a7-b8c9-1021-def0-4567890123de",
    nomeCliente: "Tech Solutions S/A",
  },
  {
    idEquipamento: 5,
    uuidEquipamento: "eq-e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    idTipoPeca: 5,
    uuidTipoPeca: "tp-e5f6a7b8",
    nmTipoPeca: "Evaporador",
    dsObservacao: "Evaporador para concentração do caldo.",
    ttPontoInspecao: 3,
    nomeEquipamento: "Evaporador Múltiplo Efeito",
    dataCadastroEquipamento: "2024-06-05",
    dataUltimaAtualizacao: "2024-06-05",
    inStatusCadastroEquipamento: true,
    dsStatusCadastroEquipamento: "Ativo",
    uuidCliente: "e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    nomeCliente: "Carlos Pereira",
  },
];

export function useEquipments() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IEquipment> | null>(null);

  const fakeGetEquipments = async (queryParams: any) => {
    const { searchIn, value } = queryParams;

    let filtered = [...equipments];

    if (searchIn && value) {
      const searchValue = value.toLowerCase();
      filtered = filtered.filter((equipment) => {
        const fieldValue = equipment[searchIn as keyof typeof equipment];
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(searchValue);
        }
        return String(fieldValue).toLowerCase().includes(searchValue);
      });
    }

    // Simulando paginação
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
        inStatusCadastroEquipamento: params?.status,
      });

      /* const { data } = await get<IEquipment>(URL_PROC_LIST_EQUIP, queryParams); */
      let { data } = await fakeGetEquipments(queryParams);

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