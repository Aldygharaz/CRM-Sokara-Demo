"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getCompanies } from "../actions/companies";
import { DataTable } from "@/components/ui/DataTable";
import { Building2 } from "lucide-react";
import { CompanyInspector } from "@/components/companies/CompanyInspector";

type Company = Awaited<ReturnType<typeof getCompanies>>[0];

export default function CompaniesPage() {
  const { language } = useStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    getCompanies().then((data) => {
      setCompanies(data);
      setIsLoading(false);
    });
  }, []);

  const t = {
    title: language === 'id' ? 'Perusahaan' : 'Companies',
    subtitle: language === 'id' ? 'Kelola akun perusahaan dan prospek' : 'Manage your company accounts and prospects',
    search: language === 'id' ? 'Cari perusahaan...' : 'Search companies...',
    presetEnterprise: language === 'id' ? 'Tipe: Enterprise' : 'Size: Enterprise',
    presetTech: language === 'id' ? 'Industri: Teknologi' : 'Industry: Technology',
  };

  const columns = [
    {
      header: language === 'id' ? 'Nama Perusahaan' : 'Company Name',
      accessorKey: 'name',
      sortable: true,
      cell: (item: Company) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-brand/10 text-brand flex items-center justify-center">
            {item.logo ? (
              <img src={item.logo} alt={item.name} className="w-full h-full object-cover rounded-md" />
            ) : (
              <Building2 className="w-4 h-4" />
            )}
          </div>
          <span className="font-medium text-text-primary">{item.name}</span>
        </div>
      )
    },
    { header: language === 'id' ? 'Industri' : 'Industry', accessorKey: 'industry', sortable: true },
    { header: language === 'id' ? 'Ukuran' : 'Size', accessorKey: 'size', sortable: true },
    { 
      header: language === 'id' ? 'Website' : 'Website', 
      accessorKey: 'website',
      cell: (item: Company) => (
        <a href={`https://${item.website}`} target="_blank" rel="noreferrer" className="text-brand hover:underline" onClick={(e) => e.stopPropagation()}>
          {item.website}
        </a>
      )
    },
    { 
      header: 'Contacts', 
      accessorKey: '_count.contacts',
      cell: (item: Company) => <span className="text-text-muted">{item._count.contacts}</span>
    },
    { 
      header: 'Deals', 
      accessorKey: '_count.deals',
      cell: (item: Company) => <span className="text-text-muted">{item._count.deals}</span>
    },
  ];

  const presets = [
    { label: t.presetEnterprise, value: 'Enterprise' },
    { label: t.presetTech, value: 'Technology' },
  ];

  // Apply preset filter logic manually since the generic data table only filters by activePreset string on the exact object? 
  // Wait, DataTable component handles search by string, but preset filter relies on `activePreset`. 
  // Let's filter data before passing it to DataTable if activePreset is set.
  const displayData = companies.filter((c) => {
    if (!activePreset) return true;
    if (activePreset === 'Enterprise') return c.size === 'Enterprise';
    if (activePreset === 'Technology') return c.industry === 'Technology';
    return true;
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
          searchKey="name"
          searchPlaceholder={t.search}
          presetFilters={presets}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
          onRowClick={(item) => setActiveCompany(item as Company)}
        />
      )}

      {/* Slide-over Inspector */}
      <CompanyInspector company={activeCompany} onClose={() => setActiveCompany(null)} />
    </div>
  );
}
