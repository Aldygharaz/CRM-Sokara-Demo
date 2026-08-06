"use client";

import { X, Building2, UserCircle, Phone, Mail } from "lucide-react";
import { useStore } from "@/store/useStore";

type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  company?: { name: string } | null;
};

export function ContactInspector({ contact, onClose }: { contact: Contact | null, onClose: () => void }) {
  const { language } = useStore();

  if (!contact) return null;

  const t = {
    about: language === 'id' ? 'Tentang Kontak' : 'About Contact',
    contactInfo: language === 'id' ? 'Informasi Kontak' : 'Contact Information',
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
            <div className="w-12 h-12 rounded-full bg-canvas border border-border-divider flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-text-muted" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">{contact.firstName} {contact.lastName}</h2>
              <p className="text-sm text-text-muted">{contact.jobTitle || 'No Title'}</p>
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
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t.contactInfo}</h3>
            
            <div className="bg-elevated border border-border-divider rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-primary">{contact.email || '-'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-primary">{contact.phone || '-'}</span>
              </div>
              {contact.company && (
                <div className="flex items-center gap-3 pt-3 border-t border-border-divider/50">
                  <Building2 className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-primary">{contact.company.name}</span>
                </div>
              )}
            </div>
          </section>

          {/* Placeholder for future Activity Timeline */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              {language === 'id' ? 'Catatan / Aktivitas' : 'Notes / Activity'}
            </h3>
            <div className="bg-canvas border border-border-divider border-dashed rounded-xl p-8 flex items-center justify-center text-sm text-text-muted text-center">
              {language === 'id' ? 'Belum ada aktivitas yang dicatat untuk kontak ini.' : 'No activity logged for this contact yet.'}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
