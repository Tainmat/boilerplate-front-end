import { ROUTE_LOGIN, ROUTE_RECOVER_PASSWORD } from "@modules/Auth/routes/Login.paths";
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

interface HeaderContextData {
  visible: boolean;
  heading: string;
  showHeader: () => void;
  hideHeader: () => void;
  setPageHeading: (heading: string) => void;
}

const Context = createContext<HeaderContextData>({} as HeaderContextData);

interface Props {
  children: ReactNode;
}

function HeaderContext({ children }: Props) {
  const location = useLocation();

  const [visible, setVisible] = useState(false);
  const [heading, setHeading] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0 });

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

  const showHeader = useCallback(() => {
    setVisible(true);
  }, []);

  const hideHeader = useCallback(() => {
    setVisible(false);
  }, []);

  const setPageHeading = useCallback((heading: string) => {
    setHeading(heading);
  }, []);

  const providerValue = useMemo(
    () => ({ visible, heading, showHeader, hideHeader, setPageHeading }),
    [visible, heading, showHeader, hideHeader, setPageHeading],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useHeaderContext(): HeaderContextData {
  return useContext(Context);
}

export { HeaderContext, useHeaderContext };
