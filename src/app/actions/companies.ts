import { useDatabaseStore } from "@/store/databaseStore";

export async function getCompanies() {
  const { companies, deals, contacts } = useDatabaseStore.getState();
  
  return companies.map(company => {
    const companyDeals = deals.filter(d => d.companyId === company.id);
    const companyContacts = contacts.filter(c => c.companyId === company.id);
    return {
      ...company,
      _count: {
        deals: companyDeals.length,
        contacts: companyContacts.length
      }
    };
  });
}
