import { Toast } from "@shared/components/Core/Toast";
import { IToastMessage } from "@shared/contexts/Toast/Toast.interface";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { v4 as uuidV4 } from "uuid";

interface ToastContextData {
  messages: IToastMessage[];
  addToast: (message: Omit<IToastMessage, "id">) => void;
  handleEmptyResult: () => void;
  handleApiRejection: () => void;
  removeToast: (id: string) => void;
}

const Context = createContext<ToastContextData>({} as ToastContextData);

interface Props {
  children: ReactNode;
}

function ToastContext({ children }: Props) {
  const [messages, setMessages] = useState<IToastMessage[]>([]);

  const addToast = useCallback(async (message: Omit<IToastMessage, "id">) => {
    window.scrollTo({ top: 0 });

    const toast = {
      id: uuidV4(),
      type: message.type,
      title: message.title,
      description: message.description,
    };

    setMessages((state) => [...state, toast]);
  }, []);

  const handleEmptyResult = useCallback(() => {
    addToast({
      type: "helper",
      title: "Ooops",
      description: "Nenhum resultado foi encontrado.",
    });
  }, [addToast]);

  const handleApiRejection = useCallback(() => {
    addToast({
      type: "warning",
      title: "Ooops",
      description: "Não foi possível prosseguir com a solicitação.",
    });
  }, [addToast]);

  const removeToast = useCallback((id: string) => {
    setMessages((state) => state.filter((s) => s.id !== id));
  }, []);

  const providerValue = useMemo(
    () => ({
      messages,
      addToast,
      handleEmptyResult,
      handleApiRejection,
      removeToast,
    }),
    [messages, addToast, handleEmptyResult, handleApiRejection, removeToast],
  );

  return (
    <Context.Provider value={providerValue}>
      <Toast messages={messages} />

      {children}
    </Context.Provider>
  );
}

function useToastContext(): ToastContextData {
  return useContext(Context);
}

export { ToastContext, useToastContext };
