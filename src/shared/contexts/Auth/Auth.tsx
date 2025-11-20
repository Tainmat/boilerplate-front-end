import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearLocalStorage,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@shared/utils/storage/local";

import { useNavigate } from "react-router-dom";
import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
import { login, fakeRequest } from "@shared/services/api/api.service";
import { decryptToPayload } from "@shared/utils/crypt";
import { useLoaderContext } from "../Loader";
import { useAuthRoles } from "@shared/hooks/services/Rules/Auth/useRoles";

interface Auth {
  expiresIn: number;
  token: string;
}

interface UserAuth {
  id: string;
  auth: Auth;
  roles: string[];
  userName: string;
  socialName: string;
  email: string;
  isFirstAccess: boolean;
  photoUrl: string | null;
  birthDate: string | null;
}

interface UserCredentials {
  username: string;
  password: string;
}

interface authResponse {
  authenticated: boolean;
  firstLogin?: boolean;
}

interface AuthContextData {
  loaded: boolean;
  user: UserAuth | null;
  signIn: (credentials: UserCredentials) => Promise<authResponse | undefined>;
  signOut: () => void;
}

const Context = createContext<AuthContextData>({} as AuthContextData);

interface Props {
  children: ReactNode;
}

function AuthContext({ children }: Props) {
  const navigate = useNavigate();

  const { hideLoader, showLoader } = useLoaderContext();

  const { handleUserRoles } = useAuthRoles();

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<UserAuth | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const ususarioLocalStorage = getLocalStorageItem("Usincheck@JOmetto:user");

    ususarioLocalStorage && setUser(ususarioLocalStorage);
  }, []);

  const signIn = useCallback(
    async (credentials: UserCredentials): Promise<authResponse | undefined> => {
      try {
        showLoader();

        setUser(null);
        removeLocalStorageItem("Usincheck@JOmetto:user");

        const { data } = await login("auth/login", credentials);

        if (data) {
          const user: UserAuth = {
            auth: {
              expiresIn: data.accessToken.expiresIn,
              token: data.accessToken.token,
            },
            id: data.user.id,
            userName: data.user.name,
            socialName: data.user.socialName,
            email: data.user.email,
            isFirstAccess: data.user.isFirstAccess,
            photoUrl: data.user.photoUrl,
            birthDate: data.user.birthDate,
            roles: data.user.profileAcronym ? [data.user.profileAcronym] : [],
          };

          /* const user: UserAuth = {
            auth: {
              expiresIn: 3600,
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.faketoken.payload.signature",
            },
            userUuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
            userName: "JOÃO DA SILVA",
            socialName: "João Silva",
            email: "joao.silva@emailfalso.com",
            companyName: "Empresa Fictícia Ltda",
            companyCnpj: "12.345.678/0001-90",
            sysPassword: true,
            teamId: "TI-001",
            position: "Desenvolvedor Full Stack",
            pis: "123.45678.90-1",
            identityNumber: "MG-12.345.678",
            cpf: "123.456.789-00",
            admissionDate: "2021-05-10T08:00:00Z",
            lastUpdateDate: "2024-06-15T14:30:00Z",
            roles: ["admin"],
          }; */
          setUser(user);
          setLocalStorageItem("Usincheck@JOmetto:user", user);

          return {
            authenticated: true,
            firstLogin: user.isFirstAccess,
          };
        }
        return { authenticated: false };
        /* return { authenticated: false }; */
      } catch {
        return undefined;
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader],
  );

  const signOut = useCallback(() => {
    clearLocalStorage();

    navigate(ROUTE_LOGIN);
    setUser(null);
  }, [navigate]);

  const providerValue = useMemo(
    () => ({
      loaded,
      user,
      signIn,
      signOut,
    }),
    [loaded, user, signIn, signOut],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useAuthContext(): AuthContextData {
  return useContext(Context);
}

export { AuthContext, useAuthContext };
