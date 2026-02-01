import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useToastContext } from "../Toast";

interface IOnlineStatusContextData {
  isOnline: boolean;
}

const Context = createContext<IOnlineStatusContextData>({} as IOnlineStatusContextData);

interface Props {
  children: ReactNode;
}

function OnlineStatusContext({ children }: Props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { addToast } = useToastContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!isFirstRender.current) {
        addToast({
          title: "Conectado à internet",
          description: "Conexão restaurada!",
          type: "success",
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (!isFirstRender.current) {
        addToast({
          title: "Sem conexão",
          description: "Modo offline ativado.",
          type: "warning",
        });
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [addToast]);

  const providerValue = useMemo(
    () => ({
      isOnline,
    }),
    [isOnline],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useOnlineStatus(): IOnlineStatusContextData {
  return useContext(Context);
}

export { OnlineStatusContext, useOnlineStatus };
