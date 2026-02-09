import { DBSchema, IDBPDatabase, openDB } from "idb";

import { IOfflineInspection } from "@/shared/store/modules/OfflineInspection";

interface InspectionDB extends DBSchema {
  inspections: {
    key: string;
    value: IOfflineInspection;
    indexes: {
      "by-date": string;
      "by-customer": string;
    };
  };
}

const DB_NAME = `usincheck-db-${String(import.meta.env.VITE_AMBIENTE)}`;
const DB_VERSION = 1;
const STORE_NAME = "inspections";

async function getDB(): Promise<IDBPDatabase<InspectionDB>> {
  return openDB<InspectionDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });

        store.createIndex("by-date", "createdAt");
        store.createIndex("by-customer", "customerId");

        console.log('✅ Object store "inspections" criado com índices');
      }
    },
  });
}

export async function add(inspection: IOfflineInspection): Promise<string> {
  try {
    const db = await getDB();
    await db.add(STORE_NAME, inspection);
    return inspection.id;
  } catch (error) {
    console.error("❌ Erro ao adicionar inspeção no IndexedDB:", error);
    throw error;
  }
}

export async function getById(id: string): Promise<IOfflineInspection | undefined> {
  try {
    const db = await getDB();
    const inspection = await db.get(STORE_NAME, id);

    return inspection;
  } catch (error) {
    console.error("❌ Erro ao buscar inspeção no IndexedDB:", error);
    throw error;
  }
}

export async function getAll(): Promise<IOfflineInspection[]> {
  try {
    const db = await getDB();
    const inspecoes = await db.getAll(STORE_NAME);
    console.log(`📦 ${inspecoes.length} inspeções carregadas do IndexedDB`);
    return inspecoes;
  } catch (error) {
    console.error("❌ Erro ao buscar todas as inspeções no IndexedDB:", error);
    throw error;
  }
}

export async function update(id: string, data: Partial<IOfflineInspection>): Promise<void> {
  try {
    const db = await getDB();

    const existing = await db.get(STORE_NAME, id);

    if (!existing) {
      throw new Error(`Inspeção ${id} não encontrada no IndexedDB`);
    }

    await db.put(STORE_NAME, { ...existing, ...data });
  } catch (error) {
    console.error("❌ Erro ao atualizar inspeção no IndexedDB:", error);
    throw error;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  } catch (error) {
    console.error("❌ Erro ao remover inspeção no IndexedDB:", error);
    throw error;
  }
}

export async function clear(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
  } catch (error) {
    console.error("❌ Erro ao limpar inspeções no IndexedDB:", error);
    throw error;
  }
}

export async function getByCustomer(customerId: string): Promise<IOfflineInspection[] | undefined> {
  try {
    const db = await getDB();
    const inspections = await db.getAllFromIndex(STORE_NAME, "by-customer", customerId);

    return inspections;
  } catch (error) {
    console.error("❌ Erro ao buscar inspeções por cliente:", error);
    throw error;
  }
}

export async function count(): Promise<number> {
  try {
    const db = await getDB();
    const total = await db.count(STORE_NAME);

    return total;
  } catch (error) {
    console.error("❌ Erro ao contar inspeções no IndexedDB:", error);
    throw error;
  }
}

export async function getStorageSize(): Promise<number> {
  try {
    const inspections = await getAll();

    const jsonString = JSON.stringify(inspections);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    return sizeInMB;
  } catch (error) {
    console.error("❌ Erro ao calcular tamanho do storage:", error);
    return 0;
  }
}

const STORAGE_LIMIT_MB = 10;

export async function getStoragePercentage(): Promise<number> {
  try {
    const usedMB = await getStorageSize();
    return Math.min((usedMB / STORAGE_LIMIT_MB) * 100, 100);
  } catch (error) {
    console.error("❌ Erro ao calcular porcentagem do storage:", error);
    return 0;
  }
}
