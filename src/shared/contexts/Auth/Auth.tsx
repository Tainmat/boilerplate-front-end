import { ROUTE_LOGIN } from "@modules/Auth/routes/Login.paths";
// import { login } from "@shared/services/api/api.service";
import {
  clearLocalStorage,
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@shared/utils/storage/local";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useLoaderContext } from "../Loader";

interface Auth {
  expiresIn: number;
  token: string;
}

interface Customers {
  id: string;
  corporateName: string;
  fantasyName: string;
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
  customers: Customers[];
}

interface UserCredentials {
  username: string;
  password: string;
}

interface authResponse {
  authenticated: boolean;
  firstLogin?: boolean;
  workOffline?: boolean;
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

const userStorageKey = `${import.meta.env.VITE_KEY_CRIPTOGRAFIA}:user`;

function AuthContext({ children }: Props) {
  const navigate = useNavigate();

  const { hideLoader, showLoader } = useLoaderContext();

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<UserAuth | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const ususarioLocalStorage = getLocalStorageItem(userStorageKey);

    if (ususarioLocalStorage) {
      setUser(ususarioLocalStorage);
    }
  }, []);

  const signIn = useCallback(
    async (credentials: UserCredentials): Promise<authResponse | undefined> => {
      try {
        showLoader();

        setUser(null);
        removeLocalStorageItem(userStorageKey);

        /*
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
            customers: data.user.customers || [],
          };

          setUser(user);
          setLocalStorageItem(userStorageKey, user);

          return {
            authenticated: true,
            firstLogin: user.isFirstAccess,
            workOffline:
              user.roles.includes(String(import.meta.env.VITE_APP_ROLE_SYSTEM_ADMIN)) ||
              user.roles.includes(String(import.meta.env.VITE_APP_ROLE_INSPECTOR)),
          };
        }
        return { authenticated: false };
        */

        const user: UserAuth = {
          auth: {
            expiresIn: 86400,
            token: "login-disabled",
          },
          id: "login-disabled",
          userName: credentials.username,
          socialName: credentials.username,
          email: credentials.username,
          isFirstAccess: false,
          photoUrl: null,
          birthDate: null,
          roles: [
            String(import.meta.env.VITE_APP_ROLE_SYSTEM_ADMIN),
            String(import.meta.env.VITE_APP_ROLE_ADMINISTRATOR),
            String(import.meta.env.VITE_APP_ROLE_INSPECTOR),
            String(import.meta.env.VITE_APP_ROLE_CUSTOMER),
          ],
          customers: [],
        };

        setUser(user);
        setLocalStorageItem(userStorageKey, user);

        return {
          authenticated: true,
          firstLogin: false,
          workOffline: true,
        };
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
