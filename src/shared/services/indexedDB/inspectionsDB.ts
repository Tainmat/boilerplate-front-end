import { IOfflineInspection } from "@/shared/store/modules/OfflineInspection";
import { DBSchema, IDBPDatabase, openDB } from "idb";

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
