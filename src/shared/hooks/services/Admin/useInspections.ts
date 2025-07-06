import { get, fakeRequest } from "@shared/services/api/api.service";
import { IApiResponse } from "@shared/services/api/api.service.interface";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

export interface IInspection {
  idInspecao: number;
  uuidInspecao: string;
  tipoInspecao: string;
  dsTipoInspecao: string;
  numeroInspecao: string;
  dataInspecao: string;
  horaInspecao: string;
  uuidCliente: string;
  nomeCliente: string;
  uuidEquipamento: string;
  nomeEquipamento: string;
  uuidInspector: string;
  nomeInspector: string;
  statusInspecao: "AGENDADA" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";
  dsStatusInspecao: string;
  prioridadeInspecao: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  dsPrioridadeInspecao: string;
  descricaoObjetivo: string;
  observacoesInspecao: string;
  dataCadastroInspecao: string;
  inStatusCadastroInspecao: boolean;
  dsStatusCadastroInspecao: string;
}

export const inspections: IInspection[] = [
  {
    idInspecao: 1,
    uuidInspecao: "insp-a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    tipoInspecao: "PREVENTIVA",
    dsTipoInspecao: "Preventiva",
    numeroInspecao: "INSP-2024-001",
    dataInspecao: "2024-12-20",
    horaInspecao: "08:00",
    uuidCliente: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    nomeCliente: "João da Silva",
    uuidEquipamento: "eq-a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    nomeEquipamento: "Moenda Principal Linha 1",
    uuidInspector: "usr-1111-aaaa",
    nomeInspector: "Thomaz Fernandes",
    statusInspecao: "AGENDADA",
    dsStatusInspecao: "Agendada",
    prioridadeInspecao: "ALTA",
    dsPrioridadeInspecao: "Alta",
    descricaoObjetivo: "Inspeção preventiva para verificar o estado geral da moenda",
    observacoesInspecao: "Verificar especialmente os roletes e sistema de lubrificação",
    dataCadastroInspecao: "2024-12-15",
    inStatusCadastroInspecao: true,
    dsStatusCadastroInspecao: "Ativo",
  },
  {
    idInspecao: 2,
    uuidInspecao: "insp-b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    tipoInspecao: "CORRETIVA",
    dsTipoInspecao: "Corretiva",
    numeroInspecao: "INSP-2024-002",
    dataInspecao: "2024-12-18",
    horaInspecao: "14:30",
    uuidCliente: "b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    nomeCliente: "Empresa XPTO Ltda",
    uuidEquipamento: "eq-b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    nomeEquipamento: "Caldeira de Vapor Principal",
    uuidInspector: "usr-2222-bbbb",
    nomeInspector: "Ana Martins",
    statusInspecao: "CONCLUIDA",
    dsStatusInspecao: "Concluída",
    prioridadeInspecao: "CRITICA",
    dsPrioridadeInspecao: "Crítica",
    descricaoObjetivo: "Inspeção corretiva devido a vazamento de vapor",
    observacoesInspecao: "Vazamento identificado na válvula de segurança. Substituição necessária.",
    dataCadastroInspecao: "2024-12-10",
    inStatusCadastroInspecao: true,
    dsStatusCadastroInspecao: "Ativo",
  },
  {
    idInspecao: 3,
    uuidInspecao: "insp-c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    tipoInspecao: "PREDITIVA",
    dsTipoInspecao: "Preditiva",
    numeroInspecao: "INSP-2024-003",
    dataInspecao: "2024-12-22",
    horaInspecao: "10:15",
    uuidCliente: "c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    nomeCliente: "Maria Oliveira",
    uuidEquipamento: "eq-c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    nomeEquipamento: "Turbina Geradora 1",
    uuidInspector: "usr-1111-aaaa",
    nomeInspector: "Thomaz Fernandes",
    statusInspecao: "EM_ANDAMENTO",
    dsStatusInspecao: "Em Andamento",
    prioridadeInspecao: "MEDIA",
    dsPrioridadeInspecao: "Média",
    descricaoObjetivo: "Análise preditiva de vibração e temperatura",
    observacoesInspecao: "Monitoramento contínuo dos parâmetros de operação",
    dataCadastroInspecao: "2024-12-12",
    inStatusCadastroInspecao: true,
    dsStatusCadastroInspecao: "Ativo",
  },
  {
    idInspecao: 4,
    uuidInspecao: "insp-d4e5f6a7-b8c9-1021-def0-4567890123de",
    tipoInspecao: "EMERGENCIAL",
    dsTipoInspecao: "Emergencial",
    numeroInspecao: "INSP-2024-004",
    dataInspecao: "2024-12-16",
    horaInspecao: "16:45",
    uuidCliente: "d4e5f6a7-b8c9-1021-def0-4567890123de",
    nomeCliente: "Tech Solutions S/A",
    uuidEquipamento: "eq-d4e5f6a7-b8c9-1021-def0-4567890123de",
    nomeEquipamento: "Centrífuga Contínua A",
    uuidInspector: "usr-2222-bbbb",
    nomeInspector: "Ana Martins",
    statusInspecao: "CANCELADA",
    dsStatusInspecao: "Cancelada",
    prioridadeInspecao: "CRITICA",
    dsPrioridadeInspecao: "Crítica",
    descricaoObjetivo: "Inspeção emergencial devido a ruído anormal",
    observacoesInspecao: "Inspeção cancelada - equipamento foi desligado para manutenção",
    dataCadastroInspecao: "2024-12-16",
    inStatusCadastroInspecao: false,
    dsStatusCadastroInspecao: "Inativo",
  },
  {
    idInspecao: 5,
    uuidInspecao: "insp-e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    tipoInspecao: "PERIODICA",
    dsTipoInspecao: "Periódica",
    numeroInspecao: "INSP-2024-005",
    dataInspecao: "2024-12-25",
    horaInspecao: "09:30",
    uuidCliente: "e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    nomeCliente: "Carlos Pereira",
    uuidEquipamento: "eq-e5f6a7b8-c9d0-2132-ef01-5678901234ef",
    nomeEquipamento: "Evaporador Múltiplo Efeito",
    uuidInspector: "usr-1111-aaaa",
    nomeInspector: "Thomaz Fernandes",
    statusInspecao: "AGENDADA",
    dsStatusInspecao: "Agendada",
    prioridadeInspecao: "BAIXA",
    dsPrioridadeInspecao: "Baixa",
    descricaoObjetivo: "Inspeção periódica mensal do evaporador",
    observacoesInspecao: "Verificar eficiência de concentração e limpeza dos tubos",
    dataCadastroInspecao: "2024-12-14",
    inStatusCadastroInspecao: true,
    dsStatusCadastroInspecao: "Ativo",
  },
];

export function useInspections() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<IInspection> | null>(null);

  const fakeGetInspections = async (queryParams: any) => {
    const { searchIn, value } = queryParams;

    let filtered = [...inspections];

    if (searchIn && value) {
      const searchValue = value.toLowerCase();
      filtered = filtered.filter((inspection) => {
        const fieldValue = inspection[searchIn as keyof typeof inspection];
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
        inStatusCadastroInspecao: params?.status,
      });

      let { data } = await fakeGetInspections(queryParams);

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