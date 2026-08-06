"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getContacts } from "../actions/contacts";
import { DataTable } from "@/components/ui/DataTable";
import { Building2, UserCircle } from "lucide-react";
import { ContactInspector } from "@/components/contacts/ContactInspector";

type Contact = Awaited<ReturnType<typeof getContacts>>[0];

export default function ContactsPage() {
  const { language } = useStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    getContacts().then((data) => {
      setContacts(data);
      setIsLoading(false);
    });
  }, []);

  const t = {
    title: language === 'id' ? 'Kontak' : 'Contacts',
    subtitle: language === 'id' ? 'Kelola semua kontak personal' : 'Manage all personal contacts',
    search: language === 'id' ? 'Cari nama kontak...' : 'Search by first name...',
    presetInbound: language === 'id' ? 'Sumber: Inbound' : 'Source: Inbound',
    presetReferral: language === 'id' ? 'Sumber: Referral' : 'Source: Referral',
  };

  const columns = [
    {
      header: language === 'id' ? 'Nama Kontak' : 'Contact Name',
      accessorKey: 'firstName',
      sortable: true,
      cell: (item: Contact) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-elevated border border-border-divider text-text-muted flex items-center justify-center overflow-hidden">
             <UserCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
             <span className="font-medium text-text-primary">{item.firstName} {item.lastName}</span>
             <span className="text-xs text-text-muted">{item.jobTitle || '-'}</span>
          </div>
        </div>
      )
    },
    { header: 'Email', accessorKey: 'email', sortable: true },
    { header: 'Phone', accessorKey: 'phone', sortable: false },
    { 
      header: language === 'id' ? 'Perusahaan' : 'Company', 
      accessorKey: 'companyId',
      sortable: true,
      cell: (item: Contact) => (
        item.company ? (
           <div className="flex items-center gap-2">
             <Building2 className="w-4 h-4 text-text-muted" />
             <span className="text-text-primary">{item.company.name}</span>
           </div>
        ) : <span className="text-text-muted">-</span>
      )
    },
    { 
      header: language === 'id' ? 'Sumber' : 'Source', 
      accessorKey: 'source',
      sortable: true,
      cell: (item: Contact) => (
         <span className="px-2 py-1 text-xs rounded-full bg-brand/10 text-brand font-medium">
           {item.source || 'Unknown'}
         </span>
      )
    },
  ];

  const presets = [
    { label: t.presetInbound, value: 'Inbound' },
    { label: t.presetReferral, value: 'Referral' },
  ];

  const displayData = contacts.filter((c) => {
    if (!activePreset) return true;
    return c.source === activePreset;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.subtitle}</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
      ) : (
        <DataTable
          data={displayData}
          columns={columns}
          searchKey="firstName"
          searchPlaceholder={t.search}
          presetFilters={presets}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
          onRowClick={(item) => setActiveContact(item as Contact)}
        />
      )}

      {/* Slide-over Inspector */}
      <ContactInspector contact={activeContact} onClose={() => setActiveContact(null)} />
    </div>
  );
}
