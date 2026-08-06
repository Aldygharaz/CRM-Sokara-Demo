import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'id';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),

      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      theme: 'dark',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'sokara-crm-storage',
    }
  )
);
