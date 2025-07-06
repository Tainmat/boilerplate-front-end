export interface IApiResponse<T> {
  data: T[];
  page: number;
  total: number;
}

export const defaultValues = {
  data: [],
  page: 0,
  total: 0,
};

interface IUsuario {
  uuidUsuario: string;
  nomeUsuario: string;
  emailUsuario: string;
  inPrimeiroAcesso: boolean;
  perfis: string[];
  modulos: any[];
}

interface IData {
  usuario: IUsuario;
  access_token: string;
}

export interface IApiLogin {
  error?: boolean;
  status_code: number;
  message: string;
  data?: IData;
  message_description?: string;
}
