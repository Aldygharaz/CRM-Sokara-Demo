"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { Shield, Briefcase } from "lucide-react";


// Mock users for the demo
const MOCK_USERS = [
  {
    id: "cmc8xy3v20000abc123",
    name: "Alex Mercer",
    email: "alex@sokara.id",
    role: "VP",
    avatar: "https://ui-avatars.com/api/?name=Alex+Mercer&background=3b82f6&color=fff",
  },
  {
    id: "cmc8xy3v20001def456",
    name: "Sarah Connor",
    email: "sarah@sokara.id",
    role: "REP",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Connor&background=10b981&color=fff",
  }
];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, language } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-base flex flex-col items-center justify-center p-6 z-50">
        <div className="w-full max-w-md card p-8 flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/sokara-logomark-transparent-dark.svg" alt="Sokara Logo" className="w-16 h-16 dark:hidden" />
            <img src="/sokara-logomark-transparent-light.svg" alt="Sokara Logo" className="w-16 h-16 hidden dark:block" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {language === 'id' ? 'Selamat Datang di Sokara CRM' : 'Welcome to Sokara CRM'}
          </h1>
          <p className="text-text-muted mb-8">
            {language === 'id' 
              ? 'Pilih akun demo untuk melanjutkan' 
              : 'Select a demo account to continue'}
          </p>

          <div className="flex flex-col gap-4 w-full">
            {MOCK_USERS.map(user => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="flex items-center p-4 border border-border-divider rounded-xl hover:border-brand hover:bg-brand/5 transition-all group text-left"
              >
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border border-border-divider" />
                <div className="ml-4 flex-1">
                  <div className="font-semibold text-text-primary group-hover:text-brand transition-colors">{user.name}</div>
                  <div className="text-sm text-text-muted flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {user.role === 'VP' ? 'VP of Sales' : 'Sales Representative'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Ambient Watermark */}
        <div className="absolute bottom-6 opacity-10 flex flex-col items-center select-none pointer-events-none">
          <span className="text-xl font-bold tracking-widest text-text-muted">DEMO ALDY ALFARISY</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
