import { useEffect, useRef, useState } from "react";
import { useToastContext } from "../contexts/Toast";

export function useOnlineStatus() {
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
          title: "Sem Internet",
          description: "Sem conexão com a internet.",
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
  }, []);

  return isOnline;
}
