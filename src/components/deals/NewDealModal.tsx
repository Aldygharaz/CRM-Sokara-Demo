"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useDatabaseStore } from "@/store/databaseStore";
import { useStore } from "@/store/useStore";

export function NewDealModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { currentUser, language } = useStore();
  const db = useDatabaseStore();
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [source, setSource] = useState("Inbound");

  // New Client States
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isNewContact, setIsNewContact] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title || !amount) return;
    if (!isNewCompany && !companyId) return;
    if (!isNewContact && !contactId) return;

    let finalCompanyId = companyId;
    let finalContactId = contactId;

    if (isNewCompany && newCompanyName) {
      const newCompany = db.addCompany({
        name: newCompanyName,
        industry: "Unknown",
        size: "Unknown",
        website: "",
      });
      finalCompanyId = newCompany.id;
    }

    if (isNewContact && newContactName) {
      const [firstName, ...lastNameArr] = newContactName.split(" ");
      const newContact = db.addContact({
        firstName,
        lastName: lastNameArr.join(" "),
        email: "",
        phone: "",
        jobTitle: "",
        companyId: finalCompanyId,
        source,
      });
      finalContactId = newContact.id;
    }

    db.addDeal({
      title,
      initialValue: Number(amount),
      amount: Number(amount),
      stage: 'new',
      source,
      repId: currentUser.id,
      companyId: finalCompanyId,
      contactId: finalContactId,
      winProbability: 10,
    });
    

    // Reset form
    setTitle("");
    setAmount("");
    setCompanyId("");
    setContactId("");
    setSource("Inbound");
    setIsNewCompany(false);
    setNewCompanyName("");
    setIsNewContact(false);
    setNewContactName("");
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-base w-full max-w-md rounded-2xl shadow-xl border border-border-divider flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-divider bg-sidebar">
          <h2 className="text-lg font-semibold text-text-primary">
            {language === 'id' ? 'Buat Deal Baru' : 'Create New Deal'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-hover text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {language === 'id' ? 'Judul Deal' : 'Deal Title'}
            </label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
              placeholder={language === 'id' ? 'Contoh: Implementasi POS Phase 1' : 'e.g. POS Implementation Phase 1'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {language === 'id' ? 'Nilai Deal (Rp)' : 'Deal Amount (Rp)'}
            </label>
            <div className="relative mb-3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-text-muted">Rp</span>
              <input 
                type="text" 
                required
                value={amount ? new Intl.NumberFormat('id-ID').format(Number(amount)) : ""}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAmount(val ? Number(val) : "");
                }}
                className="w-full bg-elevated border border-border-divider rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
                placeholder="0"
              />
            </div>
            
            {/* Quick Preset Buttons */}
            <div className="flex gap-2 mb-2">
              {[10000000, 50000000, 100000000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount((Number(amount) || 0) + preset)}
                  className="flex-1 bg-elevated hover:bg-hover border border-border-divider rounded-lg py-1.5 text-xs font-semibold text-brand transition-colors active:scale-95"
                >
                  + {preset / 1000000} {language === 'id' ? 'Juta' : 'M'}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1 flex justify-between items-center">
              {language === 'id' ? 'Perusahaan' : 'Company'}
              <button 
                type="button" 
                onClick={() => { setIsNewCompany(!isNewCompany); setCompanyId(""); setNewCompanyName(""); }}
                className="text-xs text-brand hover:underline font-semibold"
              >
                {isNewCompany ? (language === 'id' ? 'Pilih yang Ada' : 'Select Existing') : (language === 'id' ? '+ Tambah Baru' : '+ Create New')}
              </button>
            </label>
            
            {isNewCompany ? (
              <input 
                type="text" 
                required
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
                placeholder={language === 'id' ? 'Nama Perusahaan Baru...' : 'New Company Name...'}
              />
            ) : (
              <select 
                required
                value={companyId}
                onChange={e => setCompanyId(e.target.value)}
                className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
              >
                <option value="" disabled>{language === 'id' ? 'Pilih Perusahaan...' : 'Select Company...'}</option>
                {db.companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1 flex justify-between items-center">
              {language === 'id' ? 'Kontak (PIC)' : 'Contact (PIC)'}
              <button 
                type="button" 
                onClick={() => { setIsNewContact(!isNewContact); setContactId(""); setNewContactName(""); }}
                className="text-xs text-brand hover:underline font-semibold"
              >
                {isNewContact ? (language === 'id' ? 'Pilih yang Ada' : 'Select Existing') : (language === 'id' ? '+ Tambah Baru' : '+ Create New')}
              </button>
            </label>

            {isNewContact ? (
              <input 
                type="text" 
                required
                value={newContactName}
                onChange={e => setNewContactName(e.target.value)}
                className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
                placeholder={language === 'id' ? 'Nama Kontak Baru...' : 'New Contact Name...'}
              />
            ) : (
              <select 
                required
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
              >
                <option value="" disabled>{language === 'id' ? 'Pilih Kontak...' : 'Select Contact...'}</option>
                {db.contacts
                  .filter(c => !companyId || isNewCompany || c.companyId === companyId)
                  .map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {language === 'id' ? 'Sumber' : 'Source'}
            </label>
            <select 
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full bg-elevated border border-border-divider rounded-lg px-3 py-2 text-text-primary outline-none focus:border-brand transition-colors"
            >
              <option value="Inbound">Inbound</option>
              <option value="Outbound">Outbound</option>
              <option value="Referral">Referral</option>
            </select>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full bg-brand hover:bg-brand-hover text-white font-medium py-2 rounded-lg transition-colors"
            >
              {language === 'id' ? 'Buat Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
