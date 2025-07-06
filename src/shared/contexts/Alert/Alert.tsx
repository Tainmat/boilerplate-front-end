import { Alert } from "@shared/components/Core/Alert";
import { IAlertMessage } from "@shared/contexts/Alert/Alert.interface";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface AlertContextData {
  alert: IAlertMessage | null;
  addAlert: (alert: IAlertMessage) => void;
  removeAlert: () => void;
  addAlertOnCancel: (onConfirm: () => void) => void;
}

const Context = createContext<AlertContextData>({} as AlertContextData);

interface Props {
  children: ReactNode;
}

function AlertContext({ children }: Props) {
  const [alert, setAlert] = useState<IAlertMessage | null>(null);

  const addAlert = useCallback(async (alert: IAlertMessage) => {
    setAlert({
      iconModal: alert.iconModal,
      titleModal: alert.titleModal,
      iconType: alert.iconType,
      buttonType: alert.buttonType,
      title: alert.title,
      subtitle: alert.subtitle,
      description: alert.description,
      cancelTxt: alert.cancelTxt,
      confirmTxt: alert.confirmTxt,
      onCancel: alert.onCancel,
      onConfirm: alert.onConfirm,
    });
  }, []);

  const removeAlert = useCallback(() => {
    setAlert(null);
    document.body.classList.remove("no-overflow");
  }, []);

  const addAlertOnCancel = useCallback(
    (onConfirm: () => void) => {
      addAlert({
        iconModal: "error",
        titleModal: "Cancelar",
        iconType: "helper",
        buttonType: "warning",
        title: "As alterações serão perdidas",
        description: "Deseja continuar?",
        cancelTxt: "Voltar",
        confirmTxt: "Cancelar alterações",
        onConfirm,
      });
    },
    [addAlert],
  );

  const providerValue = useMemo(
    () => ({
      alert,
      addAlert,
      removeAlert,
      addAlertOnCancel,
    }),
    [alert, addAlert, removeAlert, addAlertOnCancel],
  );

  return (
    <Context.Provider value={providerValue}>
      <Alert />

      {children}
    </Context.Provider>
  );
}

function useAlertContext(): AlertContextData {
  return useContext(Context);
}

export { AlertContext, useAlertContext };
