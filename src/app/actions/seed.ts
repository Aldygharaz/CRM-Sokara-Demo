import { useDatabaseStore } from "@/store/databaseStore";

export async function resetDatabase() {
  useDatabaseStore.getState().resetToDefault();
  return { success: true };
}
