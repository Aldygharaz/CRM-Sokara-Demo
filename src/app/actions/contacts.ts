import { useDatabaseStore } from "@/store/databaseStore";

export async function getContacts() {
  const { contacts, companies } = useDatabaseStore.getState();
  
  return contacts.map(contact => ({
    ...contact,
    company: companies.find(c => c.id === contact.companyId) || null
  }));
}
