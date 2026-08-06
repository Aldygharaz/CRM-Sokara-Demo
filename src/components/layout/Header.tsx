"use client";

import { useStore } from "@/store/useStore";
import { Search, Bell, UserCircle, Globe, Moon, Sun, Wifi, WifiOff, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { resetDatabase } from "@/app/actions/seed";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Header() {
  const { language, setLanguage, currentUser, theme, setTheme } = useStore();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await resetDatabase();
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      alert("Failed to reset data");
      setIsResetting(false);
    }
  };

  return (
    <header className="h-16 bg-canvas border-b border-border-divider flex items-center justify-between px-6 shrink-0 z-10 glass-panel sticky top-0">
      {/* Search / Command Palette Trigger */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted group-focus-within:text-brand transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-elevated border border-border-divider rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            placeholder={language === 'id' ? "Cari apapun... (Ctrl+K)" : "Search anything... (Ctrl+K)"}
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-text-secondary hover:text-text-primary transition-colors p-1.5 rounded-full hover:bg-hover flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Language Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium px-2 py-1.5 rounded-md hover:bg-hover"
          >
            <Globe className="w-4 h-4" />
            <span className="uppercase">{language}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-elevated border border-border-divider rounded-lg shadow-lg py-1 z-50">
              <button
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-hover hover:text-brand"
                onClick={() => {
                  setLanguage('en');
                  setShowLangMenu(false);
                }}
              >
                English
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-hover hover:text-brand"
                onClick={() => {
                  setLanguage('id');
                  setShowLangMenu(false);
                }}
              >
                Bahasa
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="text-text-secondary hover:text-text-primary relative p-1.5 rounded-full hover:bg-hover transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-canvas" />
        </button>

        {/* Network Status */}
        {!isOnline ? (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-danger/10 text-danger text-xs font-medium rounded-full">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline (Queueing)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 text-success text-xs font-medium">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Online</span>
          </div>
        )}

        {/* User Profile */}
        <div className="relative pl-4 border-l border-border-divider">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-text-primary leading-tight group-hover:text-brand transition-colors">
                {currentUser?.name || "Alex Mercer"}
              </span>
              <span className="text-xs text-text-muted leading-tight">
                {currentUser?.role || "VP of Sales"}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-elevated overflow-hidden border border-border-divider group-hover:ring-2 group-hover:ring-brand transition-all">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-text-muted p-1" />
              )}
            </div>
          </div>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-elevated border border-border-divider rounded-xl shadow-lg py-1 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-border-divider bg-canvas/50">
                <p className="text-xs font-medium text-text-muted">Signed in as</p>
                <p className="text-sm font-semibold text-text-primary truncate">{currentUser?.email || "alex@sokara.id"}</p>
              </div>
              
              <button
                onClick={handleResetData}
                disabled={isResetting}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
              >
                <RefreshCcw className={cn("w-4 h-4", isResetting && "animate-spin")} />
                {isResetting ? "Resetting..." : "Reset Demo Data"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
