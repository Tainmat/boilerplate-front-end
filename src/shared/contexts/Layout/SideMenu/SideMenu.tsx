import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import { ROUTE_LOGIN, ROUTE_RECOVER_PASSWORD } from "@modules/Auth/routes/Login.paths";

interface SideMenuContextData {
  visible: boolean;
  showMenu: () => void;
  hideMenu: () => void;
}

const Context = createContext<SideMenuContextData>({} as SideMenuContextData);

interface Props {
  children: ReactNode;
}

function SideMenuContext({ children }: Props) {
  const location = useLocation();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case ROUTE_LOGIN:
      case ROUTE_RECOVER_PASSWORD:
        setVisible(false);
        break;

      default:
        setVisible(true);
        break;
    }
  }, [location]);

  const showMenu = useCallback(() => {
    setVisible(true);
  }, []);

  const hideMenu = useCallback(() => {
    setVisible(false);
  }, []);

  const providerValue = useMemo(
    () => ({ visible, showMenu, hideMenu }),
    [visible, showMenu, hideMenu],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useSideMenuContext(): SideMenuContextData {
  return useContext(Context);
}

export { SideMenuContext, useSideMenuContext };
