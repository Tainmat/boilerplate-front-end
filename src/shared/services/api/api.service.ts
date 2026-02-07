import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
import { authRoutes } from "@modules/Auth/routes/Login.routes";
import { ROUTE_HOME } from "@modules/Home/routes/Home.paths";
import { getAuthorizationToken } from "@shared/services/api/token";
import { clearLocalStorage } from "@shared/utils/storage/local";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async function (error: any) {
    // Erro de rede (offline) - não tem response
    if (!error.response) {
      return Promise.reject(error);
    }

    const currentPath = window.location.pathname;

    // Verifica se a rota atual está nas rotas de autenticação
    const isAuthRoute = authRoutes.some((route) => currentPath.includes(route.path));

    // Se for uma rota de autenticação, não redireciona
    if (isAuthRoute) {
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      clearLocalStorage();

      window.location.replace(`${ROUTE_LOGIN}?redirect=${window.location.pathname}`);
    }

    if (error.response.status === 403) {
      window.location.replace(`${ROUTE_HOME}`);
    }

    if (error.response.status === 400) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

/* export interface IData<T> {
  current_page: number;
  returned_items: number;
  total_pages: number;
  total_items: number;
  items: T[];
}

export interface ApiResponse<T> {
  error?: boolean;
  status_code: number;
  data?: IData<T>;
  message?: string;
  message_description?: string;
}

export interface SingleItemResponse<T> {
  error?: boolean;
  status_code: number;
  message: string;
  data?: T;
  message_description?: string[];
} */

export interface ApiResponse {
  status: number;
  data?: any;
  message?: any;
}

export async function login(
  path: string,
  body?: any,
  header?: Record<string, string>,
): Promise<ApiResponse & { error?: boolean }> {
  try {
    const response = await api.post(path, body, {
      headers: {
        ...header,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      status: error?.response?.data?.status_code || 0,
      error: true,
      message: error?.response?.data?.message || "Erro de conexão",
    };
  }
}

export async function post(
  path: string,
  body?: any,
  header?: Record<string, unknown>,
): Promise<ApiResponse> {
  const token = getAuthorizationToken();

  const response = await api.post(path, body, {
    headers: {
      Authorization: token,
      Accept: "application/json",
      ...header,
    },
  });

  return response.data;
}

export async function put(
  path: string,
  body?: any,
  header?: Record<string, unknown>,
): Promise<ApiResponse> {
  const token = getAuthorizationToken();

  const response = await api.put(path, body, {
    headers: {
      Authorization: token,
      Accept: "application/json",
      ...header,
    },
  });

  return response.data;
}

export async function get(
  path: string,
  params?: Record<string, any>,
  controller?: AbortController,
): Promise<ApiResponse> {
  const token = getAuthorizationToken();

  const response = await api.get(path, {
    params,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
    signal: controller?.signal,
  });

  return response;
}

export async function fakeRequest(
  time: number,
  values?: Record<string, any>,
): Promise<ApiResponse> {
  await new Promise((resolve) => setTimeout(resolve, time));

  return { status: 200, data: values };
}
