"use client";

import { X, Building2, Globe, Users, Briefcase } from "lucide-react";
import { useStore } from "@/store/useStore";

type Company = {
  id: string;
  name: string;
  industry?: string | null;
  size?: string | null;
  website?: string | null;
  logo?: string | null;
  _count?: {
    contacts: number;
    deals: number;
  };
};

export function CompanyInspector({ company, onClose }: { company: Company | null, onClose: () => void }) {
  const { language } = useStore();

  if (!company) return null;

  const t = {
    about: language === 'id' ? 'Profil Perusahaan' : 'Company Profile',
    metrics: language === 'id' ? 'Metrik Terkait' : 'Related Metrics',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-base/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-canvas border-l border-border-divider h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-border-divider flex items-center justify-between bg-elevated shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand overflow-hidden">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">{company.name}</h2>
              <p className="text-sm text-brand flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5" /> {company.website || 'No website'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t.about}</h3>
            
            <div className="bg-elevated border border-border-divider rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <Briefcase className="w-4 h-4" /> Industry
                </div>
                <span className="font-medium text-text-primary">{company.industry || '-'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-3 border-t border-border-divider/50">
                <div className="flex items-center gap-2 text-text-muted">
                  <Users className="w-4 h-4" /> Company Size
                </div>
                <span className="font-medium text-text-primary">{company.size || '-'}</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t.metrics}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-elevated border border-border-divider rounded-xl p-4 flex flex-col gap-1 items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">{company._count?.deals || 0}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">Active Deals</span>
              </div>
              <div className="bg-elevated border border-border-divider rounded-xl p-4 flex flex-col gap-1 items-center justify-center">
                <span className="text-2xl font-bold text-text-primary">{company._count?.contacts || 0}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">Contacts</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
