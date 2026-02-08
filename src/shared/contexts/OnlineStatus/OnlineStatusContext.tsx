import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useOfflineInspections } from "@/shared/hooks/offline/useOfflineInspections";
import { post } from "@/shared/services/api/api.service";
import { getById } from "@/shared/services/indexedDB/inspectionsDB";

import { useToastContext } from "../Toast";

interface IOnlineStatusContextData {
  isOnline: boolean;
  isSyncing: boolean;
  syncInspection: (id: string) => Promise<boolean>;
  syncAll: () => Promise<void>;
}

const Context = createContext<IOnlineStatusContextData>({} as IOnlineStatusContextData);

interface Props {
  children: ReactNode;
}

function OnlineStatusContext({ children }: Props) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const { addToast } = useToastContext();
  const isFirstRender = useRef(true);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onlineStableTimeRef = useRef<NodeJS.Timeout | null>(null);

  const { cardsList, removeInspection, markAsSync, markErrorSync } = useOfflineInspections();

  const syncInspection = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        markAsSync(id);

        // Buscar dados completos
        const fullData = await getById(id);
        if (!fullData) throw new Error("Inspeção não encontrada");

        // Coletar imagens base64
        const images: string[] = [];
        if (fullData.additionalImages?.images) {
          fullData.additionalImages.images.forEach((img) => {
            if (img && img.base64) {
              images.push(img.base64);
            }
          });
        }

        // Preparar dados para API (com imagens no mesmo payload)
        const apiData = {
          customerId: fullData.customerId,
          inspectorUserId: fullData.inspectorUserId,
          partTypeId: fullData.partTypeId,
          reportNumber: fullData.reportNumber,
          reportStartDate: fullData.reportStartDate,
          reportEndDate: fullData.reportEndDate,
          revisionNumber: fullData.revisionNumber,
          sheetNumber: fullData.sheetNumber,
          componentId: fullData.componentId,
          positionNumber: fullData.positionNumber || "",
          inspectionLocation: fullData.inspectionLocation,
          mdaInformation: fullData.mdaInformation,
          isVI: fullData.isVI,
          isDM: fullData.isDM,
          isPM: fullData.isPM,
          isUS: fullData.isUS,
          isLP: fullData.isLP,
          isDU: fullData.isDU,
          finalConclusion: fullData.finalConclusion,
          inspectionStatusId: fullData.inspectionStatusId,
          isSandingBrushSandblasting: fullData.isSandingBrushSandblasting,
          isCleaningChemistry: fullData.isCleaningChemistry,
          instruments: fullData.instruments,
          position1: fullData.selectedPositions?.includes(1) ? "Posição 1 selecionada" : "",
          position2: fullData.selectedPositions?.includes(2) ? "Posição 2 selecionada" : "",
          position3: fullData.selectedPositions?.includes(3) ? "Posição 3 selecionada" : "",
          position4: fullData.selectedPositions?.includes(4) ? "Posição 4 selecionada" : "",
          position5: fullData.selectedPositions?.includes(5) ? "Posição 5 selecionada" : "",
          position6: fullData.selectedPositions?.includes(6) ? "Posição 6 selecionada" : "",
          flankAndBottomConclusion: "",
          keywayChannelsConclusion: "",
          additionalObservations: "",
          images: images.length > 0 ? images : undefined,
          isActive: fullData.isActive,
        };

        // POST na API (inspeção + imagens atômico)
        await post("/operational/parts-inspection", apiData);

        // Remover do offline
        await removeInspection(id);

        addToast({
          type: "success",
          title: "Sincronizado!",
          description: `Inspeção ${fullData.reportNumber} enviada com sucesso.`,
        });

        return true;
      } catch (error: any) {
        markErrorSync(id, error?.response?.data?.message || error?.message || "Erro desconhecido");

        addToast({
          type: "warning",
          title: "Erro ao sincronizar",
          description: error?.response?.data?.message || "Tente novamente mais tarde.",
        });

        return false;
      }
    },
    [addToast, removeInspection, markAsSync, markErrorSync],
  );

  const syncAll = useCallback(async () => {
    if (cardsList.length === 0) return;

    setIsSyncing(true);

    addToast({
      type: "info",
      title: "Sincronizando...",
      description: `Enviando ${cardsList.length} inspeção(ões) offline.`,
    });

    // Ordenar: erros primeiro, depois FIFO
    const sortedList = [...cardsList].sort((a, b) => {
      if (a.erroSync && !b.erroSync) return -1;
      if (!a.erroSync && b.erroSync) return 1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    let successCount = 0;
    let errorCount = 0;

    // Processar sequencialmente
    for (const card of sortedList) {
      const success = await syncInspection(card.id);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    setIsSyncing(false);

    // Toast final
    if (successCount > 0) {
      addToast({
        type: "success",
        title: "Sincronização concluída",
        description: `${successCount} inspeção(ões) enviada(s). ${errorCount > 0 ? `${errorCount} com erro.` : ""}`,
      });
    }
  }, [cardsList, syncInspection, addToast]);

  useEffect(() => {
    const handleOnline = () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (onlineStableTimeRef.current) {
        clearTimeout(onlineStableTimeRef.current);
      }

      setIsOnline(true);
      if (!isFirstRender.current) {
        addToast({
          title: "Conectado à internet",
          description: "Conexão restaurada!",
          type: "success",
        });
      }

      onlineStableTimeRef.current = setTimeout(() => {
        if (navigator.onLine && cardsList.length > 0) {
          console.log("🔄 Conexão estável há 30s. Iniciando sincronização...");
          syncAll();
        }
      }, 30000);
    };

    const handleOffline = () => {
      setIsOnline(false);

      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = null;
      }
      if (onlineStableTimeRef.current) {
        clearTimeout(onlineStableTimeRef.current);
        onlineStableTimeRef.current = null;
      }

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
  }, [addToast, cardsList.length, syncAll]);

  const providerValue = useMemo(
    () => ({
      isOnline,
      syncInspection,
      isSyncing,
      syncAll,
    }),
    [isOnline, syncInspection, isSyncing, syncAll],
  );

  return <Context.Provider value={providerValue}>{children}</Context.Provider>;
}

function useOnlineStatus(): IOnlineStatusContextData {
  return useContext(Context);
}

export { OnlineStatusContext, useOnlineStatus };
