// Removed "use server" - Now runs on client
import { useDatabaseStore, DealStage } from "@/store/databaseStore";

export async function getDeals(userId: string, role: string) {
  const { deals, companies, contacts, users } = useDatabaseStore.getState();
  
  let visibleDeals = deals;
  if (role !== 'VP') {
    visibleDeals = deals.filter(d => d.repId === userId);
  }

  // Join relations manually
  return visibleDeals.map(deal => ({
    ...deal,
    company: companies.find(c => c.id === deal.companyId) || null,
    contact: contacts.find(c => c.id === deal.contactId) || null,
    rep: users.find(u => u.id === deal.repId) || null,
  }));
}

export async function updateDealStage(dealId: string, stage: DealStage) {
  useDatabaseStore.getState().updateDealStage(dealId, stage);
  return { success: true };
}

export async function updateDealAmount(dealId: string, amount: number) {
  const state = useDatabaseStore.getState();
  const newDeals = state.deals.map(d => d.id === dealId ? { ...d, amount } : d);
  state.setDeals(newDeals);
  return { success: true };
}
