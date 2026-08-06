"use client";

import { useStore } from "@/store/useStore";
import { Moon, Sun, Globe, Database, UserCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const { language, setLanguage, currentUser, setCurrentUser, theme, setTheme } = useStore();

  const t = {
    title: language === 'id' ? 'Pengaturan' : 'Settings',
    subtitle: language === 'id' ? 'Konfigurasi preferensi aplikasi' : 'Configure application preferences',
    appearance: language === 'id' ? 'Tampilan' : 'Appearance',
    languageLabel: language === 'id' ? 'Bahasa' : 'Language',
    dbAction: language === 'id' ? 'Reset Database' : 'Reset Database',
    logoutAction: language === 'id' ? 'Ganti Akun Demo' : 'Switch Demo Account',
  };

  const handleResetDB = async () => {
    const confirm = window.confirm(
      language === 'id' 
        ? "Ini akan menghapus seluruh data dan menjalankan seed. Lanjutkan?" 
        : "This will wipe all data and run seed. Continue?"
    );
    if (confirm) {
      alert("Please run `npm run db:seed` in the terminal to reset the database.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto h-full">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t.title}</h1>
        <p className="text-sm text-text-muted mt-1">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Profile Card */}
        <div className="card p-6 flex items-center gap-4">
          <img src={currentUser?.avatar || ""} alt="" className="w-16 h-16 rounded-full border border-border-divider" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-text-primary">{currentUser?.name}</h3>
            <p className="text-sm text-text-secondary">{currentUser?.role === 'VP' ? 'VP of Sales' : 'Sales Representative'}</p>
            <p className="text-xs text-text-muted mt-1">{currentUser?.email}</p>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="px-4 py-2 border border-border-divider rounded-lg hover:border-brand hover:text-brand transition-colors text-sm font-medium flex items-center gap-2"
          >
            <UserCircle className="w-4 h-4" />
            {t.logoutAction}
          </button>
        </div>

        {/* Preferences */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border-divider bg-canvas/50">
            <h3 className="font-semibold text-text-primary">{t.appearance} & {t.languageLabel}</h3>
          </div>
          <div className="p-6 flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-elevated border border-border-divider flex items-center justify-center">
                  <Globe className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{t.languageLabel}</h4>
                  <p className="text-xs text-text-muted">Select application language</p>
                </div>
              </div>
              <div className="flex bg-elevated rounded-lg p-1 border border-border-divider">
                <button
                  onClick={() => setLanguage('en')}
                  className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", language === 'en' ? "bg-brand text-white" : "text-text-secondary hover:text-text-primary")}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('id')}
                  className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", language === 'id' ? "bg-brand text-white" : "text-text-secondary hover:text-text-primary")}
                >
                  Bahasa
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-elevated border border-border-divider flex items-center justify-center">
                  <Moon className="w-5 h-5 text-text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">Theme</h4>
                  <p className="text-xs text-text-muted">Apple HIG Dark Mode (Default)</p>
                </div>
              </div>
              <div className="flex bg-elevated rounded-lg p-1 border border-border-divider">
                <button
                  onClick={() => setTheme('dark')}
                  className={cn("px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors", theme === 'dark' ? "bg-brand text-white" : "text-text-secondary hover:text-text-primary")}
                >
                  <Moon className="w-4 h-4" /> Dark
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={cn("px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors", theme === 'light' ? "bg-brand text-white" : "text-text-secondary hover:text-text-primary")}
                >
                  <Sun className="w-4 h-4" /> Light
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border-danger/20 overflow-hidden">
          <div className="p-4 border-b border-danger/20 bg-danger/5">
            <h3 className="font-semibold text-danger">Danger Zone</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">Database Reset</h4>
                  <p className="text-xs text-text-muted">Delete all records and re-seed the demo database</p>
                </div>
              </div>
              <button 
                onClick={handleResetDB}
                className="px-4 py-2 border border-danger/50 text-danger rounded-lg hover:bg-danger hover:text-white transition-colors text-sm font-medium"
              >
                {t.dbAction}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
