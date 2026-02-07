//src/shared/hooks/offline/useOfflineInspections.ts
import * as inspectionsDB from "@shared/services/indexedDB/inspectionsDB";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import { IInspectionRegisterForm } from "@/modules/Admin/Inspections/pages/CreateInspection/components/RegisterForm/RegisterForm.form";
import {
  addCard,
  clearCurrent,
  IOfflineInspection,
  IOfflineInspectionCard,
  removeCard,
  setCardsList,
  setCurrent,
  updateCard,
} from "@/shared/store/modules/OfflineInspection";
import { RootState } from "@/shared/store/store";

export function useOfflineInspections() {
  const dispatch = useDispatch();

  const cardsList = useSelector((state: RootState) => state.offlineInspectionsData.cardsList);
  const currentInspection = useSelector(
    (state: RootState) => state.offlineInspectionsData.currentInspection,
  );
  const isSync = useSelector((state: RootState) => state.offlineInspectionsData.isSync);

  const loadCards = useCallback(async () => {
    try {
      const inspectionsOffline = await inspectionsDB.getAll();

      const cards: IOfflineInspectionCard[] = inspectionsOffline.map((i) => ({
        id: i.id,
        customerId: i.customerId,
        reportNumber: i.reportNumber,
        partTypeId: i.partTypeId,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        revisionNumber: i.revisionNumber,
        customer: i.customer,
        inspectorUser: i.inspectorUser,
        inspectionStatus: i.inspectionStatus,
        isActive: i.isActive,
        isSyncing: i.isSyncing ?? false,
        erroSync: i.erroSync,
        syncAttempts: i.syncAttempts ?? 0,
        quantityPhotos: i.additionalImages?.images?.filter((img) => img !== null).length || 0,
      }));

      dispatch(setCardsList(cards));
    } catch (error) {
      console.error("❌ Erro ao carregar cards do IndexedDB:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const loadFullInspection = useCallback(
    async (id: string) => {
      try {
        const fullInspection = await inspectionsDB.getById(id);

        if (fullInspection) {
          dispatch(setCurrent(fullInspection));
          console.log(`📄 Inspeção completa carregada: ${id}`);
        } else {
          console.warn(`⚠️ Inspeção não encontrada: ${id}`);
        }
      } catch (error) {
        console.error("❌ Erro ao carregar inspeção completa:", error);
      }
    },
    [dispatch],
  );

  const addNewInspection = useCallback(
    async (
      data: Omit<
        IOfflineInspection,
        "id" | "createdAt" | "updatedAt" | "isSyncing" | "erroSync" | "syncAttempts"
      >,
    ) => {
      try {
        const id = uuidv4();
        const now = new Date().toISOString();

        const newInspection: IOfflineInspection = {
          ...data,
          customer: {
            id: data.customer.id,
            corporateName: data.customer.corporateName,
            fantasyName: data.customer.fantasyName,
          },
          inspectorUser: {
            id: data.inspectorUser.id,
            name: data.inspectorUser.name,
          },
          inspectionStatus: {
            id: data.inspectionStatus.id,
            description: data.inspectionStatus.description,
          },
          id,
          createdAt: now,
          updatedAt: now,
          isSyncing: false,
          erroSync: undefined,
          syncAttempts: 0,
        };

        await inspectionsDB.add(newInspection);

        const card: IOfflineInspectionCard = {
          id,
          reportNumber: data.reportNumber,
          revisionNumber: data.revisionNumber,
          customer: data.customer,
          inspectorUser: data.inspectorUser,
          inspectionStatus: data.inspectionStatus,
          isActive: data.isActive,
          createdAt: now,
          updatedAt: now,
          isSyncing: false,
          syncAttempts: 0,
          quantityPhotos: data.additionalImages?.images?.filter((img) => img !== null).length || 0,
        };

        dispatch(addCard(card));
        return id;
      } catch (error) {
        console.error("❌ Erro ao adicionar inspeção offline:", error);
        throw error;
      }
    },
    [dispatch],
  );

  const updateInspection = useCallback(
    async (id: string, data: Partial<IInspectionRegisterForm>) => {
      try {
        const now = new Date().toISOString();

        const inspection = await inspectionsDB.getById(id);

        if (!inspection) {
          throw new Error(`Inspeção ${id} não encontrada`);
        }

        const updatedInspection: IOfflineInspection = {
          ...inspection,
          ...data,
          updatedAt: now,
        };

        await inspectionsDB.update(id, updatedInspection);

        const updatedCard: Partial<IOfflineInspectionCard> = {
          reportNumber: updatedInspection.reportNumber,
          revisionNumber: updatedInspection.revisionNumber,
          customer: updatedInspection.customer,
          inspectorUser: updatedInspection.inspectorUser,
          inspectionStatus: updatedInspection.inspectionStatus,
          updatedAt: now,
          quantityPhotos:
            updatedInspection.additionalImages?.images?.filter((img) => img !== null).length || 0,
        };

        dispatch(updateCard({ id, data: updatedCard }));

        if (currentInspection?.id === id) {
          dispatch(setCurrent(updatedInspection));
        }
      } catch (error) {
        console.error("❌ Erro ao carregar inspeção completa:", error);
      }
    },
    [dispatch, currentInspection],
  );

  const removeInspection = useCallback(
    async (id: string) => {
      try {
        await inspectionsDB.remove(id);

        dispatch(removeCard(id));

        if (currentInspection?.id === id) {
          dispatch(clearCurrent());
        }
      } catch (error) {
        console.error("❌ Erro ao remover inspeção offline:", error);
        throw error;
      }
    },
    [dispatch, currentInspection],
  );

  const clearCurrentInspection = useCallback(() => {
    dispatch(clearCurrent());
  }, [dispatch]);

  const markAsSync = useCallback(
    async (id: string) => {
      dispatch(updateCard({ id, data: { isSyncing: true } }));
      await inspectionsDB.update(id, { isSyncing: true });
    },
    [dispatch],
  );

  const markErrorSync = useCallback(
    async (id: string, error: string) => {
      const card = cardsList.find((c) => c.id === id);
      const syncData = {
        isSyncing: false,
        erroSync: error,
        syncAttempts: (card?.syncAttempts || 0) + 1,
      };
      dispatch(updateCard({ id, data: syncData }));
      await inspectionsDB.update(id, syncData);
    },
    [dispatch, cardsList],
  );

  const resetSync = useCallback(
    async (id: string) => {
      const syncData = {
        isSyncing: false,
        erroSync: undefined,
        syncAttempts: 0,
      };
      dispatch(updateCard({ id, data: syncData }));
      await inspectionsDB.update(id, syncData);
    },
    [dispatch],
  );

  return {
    // Estados ✅ ADICIONADO
    cardsList,
    currentInspection,
    isSync,

    // Funções
    loadCards,
    loadFullInspection,
    addNewInspection,
    removeInspection,
    updateInspection,
    clearCurrentInspection,

    // Sincronização
    markAsSync,
    markErrorSync,
    resetSync,
  };
}
