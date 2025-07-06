import { ROUTE_LOGIN, ROUTE_RECOVER_PASSWORD } from "@modules/Auth/routes/Login.paths";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface ContentContextDat {
  visible: boolean;
}

const Context = createContext<ContentContextDat>({} as ContentContextDat);

interface Props {
  children: ReactNode;
}

function ContentContext({ children }: Props) {
  const location = useLocation();

  const [visible, setVisible] = useState(false);

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

  const providerValue = useMemo(() => ({ visible }), [visible]);

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useContentContext(): ContentContextDat {
  return useContext(Context);
}

export { ContentContext, useContentContext };
