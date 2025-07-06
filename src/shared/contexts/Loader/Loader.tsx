import { Loader } from "@shared/components/Core/Loader";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface LoaderContextData {
  showLoader: () => void;
  hideLoader: () => void;
}

const Context = createContext<LoaderContextData>({} as LoaderContextData);

interface Props {
  children: ReactNode;
}

function LoaderContext({ children }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("no-overflow");
    } else {
      const hasOtherModals = document.getElementsByName("custome-modal");

      if (hasOtherModals.length === 0) {
        document.body.classList.remove("no-overflow");
      }
    }
  }, [visible]);

  const showLoader = useCallback(() => {
    setVisible(true);
  }, []);

  const hideLoader = useCallback(() => {
    setVisible(false);
  }, []);

  const providerValue = useMemo(
    () => ({
      showLoader,
      hideLoader,
    }),
    [showLoader, hideLoader],
  );

  return (
    <Context.Provider value={providerValue}>
      <>
        {visible && <Loader />}

        {children}
      </>
    </Context.Provider>
  );
}

function useLoaderContext(): LoaderContextData {
  return useContext(Context);
}

export { LoaderContext, useLoaderContext };
