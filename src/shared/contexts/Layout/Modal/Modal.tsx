import { fakeRequest } from "@shared/services/api/api.service";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

interface ModalContextData {
  amount: number;
}

const Context = createContext<ModalContextData>({} as ModalContextData);

interface Props {
  children: ReactNode;
}

function ModalContext({ children }: Props) {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function callback() {
      await fakeRequest(100);

      const openedModals = document.getElementsByClassName("custom-modal").length;

      openedModals > 0
        ? document.body.classList.add("no-overflow")
        : document.body.classList.remove("no-overflow");

      setAmount(openedModals);
    }

    const targetNode = document.getElementById("modal");

    if (targetNode) {
      const config = { attributes: true, childList: true, subtree: true };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);

      // Limpeza do observer
      return () => observer.disconnect();
    }

    return undefined;
  }, []);

  const providerValue = useMemo(() => ({ amount }), [amount]);

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useModalContext(): ModalContextData {
  return useContext(Context);
}

export { ModalContext, useModalContext };
