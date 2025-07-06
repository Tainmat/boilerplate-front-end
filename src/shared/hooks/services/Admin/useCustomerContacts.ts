/* import { URL_PROC_LIST_CONT_CLIE } from "@shared/constants/urls"; */
import { get, fakeRequest } from "@shared/services/api/api.service";
import { removeEmptyEntries } from "@shared/utils/generic";
import { useCallback, useEffect, useState } from "react";

import { IApiResponse } from "@/shared/services/api/api.service.interface";

export interface ICustomerContacts {
  dataCadastroContatoCliente: string;
  descricaoObservacoesContatoCliente: string;
  dsRecebeEmail: string;
  dsResponsavelLegal: string;
  dsResponsavelTecnico: string;
  inWhatsAppContatoCliente: boolean;
  dsWhatsAppContatoCliente: string;
  dsStatusCadastroContatoCliente: string;
  idCliente: number;
  idContatoCliente: number;
  inRecebeEmail: boolean;
  inResponsavelLegal: boolean;
  inResponsavelTecnico: boolean;
  inStatusCadastroContatoCliente: boolean;
  nomeCliente: string;
  numeroRamalContatoCliente: string;
  numeroCelularContatoCliente: string;
  nomeContatoCliente: string;
  dsEmailContatoCliente: string;
  numeroTelefoneContatoCliente: string;
  uuidCliente: string;
  uuidContatoCliente: string;
}

export const customerContacts: ICustomerContacts[] = [
  {
    idContatoCliente: 1,
    uuidContatoCliente: "111a-222b-333c-444d",
    idCliente: 1,
    uuidCliente: "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    nomeCliente: "João da Silva",
    numeroRamalContatoCliente: "123",
    numeroCelularContatoCliente: "(11) 98765-4321",
    nomeContatoCliente: "Mariana Souza",
    dsEmailContatoCliente: "mariana.souza@joaotech.com",
    numeroTelefoneContatoCliente: "(11) 98765-4321",
    dataCadastroContatoCliente: "2024-01-16",
    descricaoObservacoesContatoCliente: "Assistente comercial.",
    inStatusCadastroContatoCliente: true,
    dsStatusCadastroContatoCliente: "Ativo",
    inRecebeEmail: true,
    dsRecebeEmail: "Sim",
    inResponsavelLegal: false,
    dsResponsavelLegal: "Não",
    inWhatsAppContatoCliente: true,
    dsWhatsAppContatoCliente: "Sim",
    inResponsavelTecnico: false,
    dsResponsavelTecnico: "Não",
  },
  {
    idContatoCliente: 2,
    uuidContatoCliente: "222a-333b-444c-555d",
    idCliente: 2,
    uuidCliente: "b2c3d4e5-f6a7-8910-bcde-2345678901bc",
    nomeCliente: "Empresa XPTO Ltda",
    numeroRamalContatoCliente: "456",
    numeroCelularContatoCliente: "(21) 97654-3210",
    nomeContatoCliente: "Carlos Lima",
    dsEmailContatoCliente: "carlos.lima@xpto.com.br",
    numeroTelefoneContatoCliente: "(21) 97654-3210",
    dataCadastroContatoCliente: "2023-12-05",
    descricaoObservacoesContatoCliente: "Responsável técnico da empresa.",
    inStatusCadastroContatoCliente: true,
    dsStatusCadastroContatoCliente: "Ativo",
    inRecebeEmail: true,
    dsRecebeEmail: "Sim",
    inResponsavelLegal: false,
    dsResponsavelLegal: "Não",
    inWhatsAppContatoCliente: false,
    dsWhatsAppContatoCliente: "Não",
    inResponsavelTecnico: true,
    dsResponsavelTecnico: "Sim",
  },
  {
    idContatoCliente: 3,
    uuidContatoCliente: "333a-444b-555c-666d",
    idCliente: 3,
    uuidCliente: "c3d4e5f6-a7b8-9101-cdef-3456789012cd",
    nomeCliente: "Maria Oliveira",
    numeroRamalContatoCliente: "",
    numeroCelularContatoCliente: "(31) 91234-5678",
    nomeContatoCliente: "Ana Clara",
    dsEmailContatoCliente: "ana.clara@mariaartes.com",
    numeroTelefoneContatoCliente: "(31) 91234-5678",
    dataCadastroContatoCliente: "2024-03-25",
    descricaoObservacoesContatoCliente: "Responsável legal da cliente.",
    inStatusCadastroContatoCliente: true,
    dsStatusCadastroContatoCliente: "Ativo",
    inRecebeEmail: false,
    dsRecebeEmail: "Não",
    inResponsavelLegal: true,
    dsResponsavelLegal: "Sim",
    inWhatsAppContatoCliente: true,
    dsWhatsAppContatoCliente: "Sim",
    inResponsavelTecnico: false,
    dsResponsavelTecnico: "Não",
  },
  {
    idContatoCliente: 4,
    uuidContatoCliente: "444a-555b-666c-777d",
    idCliente: 4,
    uuidCliente: "d4e5f6a7-b8c9-1021-def0-4567890123de",
    nomeCliente: "Tech Solutions S/A",
    numeroRamalContatoCliente: "789",
    numeroCelularContatoCliente: "(41) 94567-1234",
    nomeContatoCliente: "Roberta Mendes",
    dsEmailContatoCliente: "roberta@techsol.com",
    numeroTelefoneContatoCliente: "(41) 94567-1234",
    dataCadastroContatoCliente: "2024-05-12",
    descricaoObservacoesContatoCliente: "Contato principal para suporte.",
    inStatusCadastroContatoCliente: false,
    dsStatusCadastroContatoCliente: "Inativo",
    inRecebeEmail: true,
    dsRecebeEmail: "Sim",
    inResponsavelLegal: false,
    dsResponsavelLegal: "Não",
    inWhatsAppContatoCliente: false,
    dsWhatsAppContatoCliente: "Não",
    inResponsavelTecnico: true,
    dsResponsavelTecnico: "Sim",
  },
];

export function useCustomerContacts() {
  const [params, setParams] = useState<Record<string, any> | null>(null);
  const [result, setResult] = useState<IApiResponse<ICustomerContacts> | null>(null);

  const fetchData = useCallback(async (params: Record<string, any>) => {
    try {
      setResult(null);

      const queryParams = removeEmptyEntries({
        searchIn: params?.searchIn,
        value: params?.value,
        items: params?.items,
        page: params?.page,
        sort: params?.sort,
        order: params?.order,
        inStatusCadastroContatoCliente: params?.status,
        uuidCliente: params.uuidCustomer,
      });

      /* const { data } = await get<ICustomerContacts>(URL_PROC_LIST_CONT_CLIE, queryParams); */

      const { uuidCliente } = queryParams;

      const filteredContacts = customerContacts.filter((c) => c.uuidCliente === uuidCliente);

      let { data } = await fakeRequest(2000, queryParams);

      data = {
        items: filteredContacts,
        current_page: 1,
        total_items: filteredContacts.length,
      };

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