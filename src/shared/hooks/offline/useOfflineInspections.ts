import { RootState } from "@/shared/store/store";
import * as inspectionsDB from "@shared/services/indexedDB/inspectionsDB";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useOfflineInspections() {
  const dispatch = useDispatch();

  const cardsList = useSelector((state: RootState) => state.offlineInspectionsData.cardsList);
  const currentInspection = useSelector(
    (state: RootState) => state.offlineInspectionsData.currentInspection,
  );
  const isSync = useSelector((state: RootState) => state.offlineInspectionsData.isSync);

  const loadCards = useCallback(async () => {
    try {
      const inspectionOffline = await inspectionsDB.getAll();
    } catch (error) {
      console.error("❌ Erro ao carregar cards do IndexedDB:", error);
    }
  }, []);
}
