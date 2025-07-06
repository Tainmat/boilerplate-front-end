import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface RefreshContextData {
  refreshKey: string;
  onRefresh: () => void;
}

const Context = createContext<RefreshContextData>({} as RefreshContextData);

interface Props {
  children: ReactNode;
}

function RefreshKeyContext({ children }: Props) {
  const [refreshKey, setRefreshKey] = useState<string>(uuidv4());

  const onRefresh = useCallback(() => {
    setRefreshKey(uuidv4());
  }, []);

  const providerValue = useMemo(
    () => ({
      refreshKey,
      onRefresh,
    }),
    [refreshKey, onRefresh],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useRefreshKeyContext(): RefreshContextData {
  return useContext(Context);
}

export { RefreshKeyContext, useRefreshKeyContext };
