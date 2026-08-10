"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { getDeals, updateDealStage } from "../actions/deals";
import { KanbanBoard, Deal } from "@/components/deals/KanbanBoard";
import { Plus, Wifi, WifiOff, FilterX, Trophy, TrendingDown } from "lucide-react";
import PokaYokeModal from "@/components/ui/PokaYokeModal";
import { DealInspector } from "@/components/deals/DealInspector";
import { NewDealModal } from "@/components/deals/NewDealModal";
import useSWR from "swr";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function DealsPage() {
  const { language, currentUser, globalSearchQuery } = useStore();
  
  const { data: deals = [], mutate, isLoading } = useSWR<Deal[]>(
    currentUser ? `deals-${currentUser.id}` : null,
    () => getDeals(currentUser!.id, currentUser!.role) as Promise<Deal[]>,
    { fallbackData: [], revalidateOnFocus: true }
  );

  const [inspectingDeal, setInspectingDeal] = useState<Deal | null>(null);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  
  // Offline & Sync Queue State
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncQueue, setSyncQueue] = useState<{id: string, stage: string}[]>([]);

  // Filter State
  const [activeFilter, setActiveFilter] = useState<'all' | 'my-deals' | 'stale' | 'high-value'>('all');

  // Poka-Yoke State
  const [pokaYoke, setPokaYoke] = useState<{isOpen: boolean, dealId?: string, targetStage?: string}>({ isOpen: false });

  useEffect(() => {

    // Setup Offline/Online Listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Ctrl + Shift + F to reset filters
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setActiveFilter('all');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync Queue Processor
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      const processQueue = async () => {
        for (const item of syncQueue) {
          try {
            await updateDealStage(item.id, item.stage as 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost');
          } catch {
            console.error("Failed to sync queue item", item);
          }
        }
        setSyncQueue([]);
      };
      processQueue();
    }
  }, [isOnline, syncQueue]);

  const handleDealMove = async (dealId: string, newStage: string) => {
    const deal = deals.find(d => d.id === dealId);
    
    // Optimistic Update First (UX feels instant)
    const optimisticDeals = deals.map(d => d.id === dealId ? { ...d, stage: newStage, staleDays: 0 } : d);
    mutate(optimisticDeals, false);
    
    // POKA-YOKE: Cegah deal pindah ke Won/Lost jika data perusahaan kosong atau stale > 30 hari
    if (deal && deal.staleDays > 30 && (newStage === 'won' || newStage === 'lost')) {
      setPokaYoke({ isOpen: true, dealId, targetStage: newStage });
      return; // Stop execution, await PokaYoke resolution
    }

    executeMove(dealId, newStage);
  };

  const executeMove = async (dealId: string, newStage: string) => {
    if (!isOnline) {
      setSyncQueue(prev => [...prev, { id: dealId, stage: newStage }]);
      toast.info('Disimpan secara offline. Akan disinkronkan saat koneksi kembali.');
      return;
    }

    try {
      await updateDealStage(dealId, newStage as 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost');
      
      if (newStage === 'won') {
        toast.success(language === 'id' ? 'Deal Dimenangkan! Luar biasa!' : 'Deal Won! Outstanding!', {
          description: language === 'id' ? 'Berhasil mengamankan deal ini ke tahap akhir.' : 'Successfully secured this deal to the final stage.',
          icon: <Trophy className="w-5 h-5 text-warning" />,
          duration: 5000,
        });
      } else if (newStage === 'lost') {
        toast(language === 'id' ? 'Deal Hilang' : 'Deal Lost', {
          description: language === 'id' ? 'Jangan menyerah, evaluasi dan coba lagi!' : 'Don\'t give up, evaluate and try again!',
          icon: <TrendingDown className="w-5 h-5 text-danger" />,
        });
      } else {
        toast.success(language === 'id' ? 'Status deal berhasil diperbarui!' : 'Deal stage updated successfully!');
      }
      
      mutate(); // Revalidate from source
    } catch (error) {
      console.error("Failed to update deal", error);
      toast.error(language === 'id' ? 'Gagal memperbarui status deal.' : 'Failed to update deal stage.');
      mutate(); // Revert to original
    }
  };

  const t = {
    title: language === 'id' ? 'Pipeline' : 'Pipeline',
    subtitle: language === 'id' ? 'Kelola peluang dan negosiasi (Drag & Drop)' : 'Manage opportunities and negotiations (Drag & Drop)',
    newDeal: language === 'id' ? 'Deal Baru' : 'New Deal',
    filters: {
      all: language === 'id' ? 'Semua Deal' : 'All Deals',
      myDeals: language === 'id' ? 'Deal Saya' : 'My Deals',
      stale: language === 'id' ? 'Stale (>5 Hari)' : 'Stale (>5 Days)',
      highValue: language === 'id' ? 'High Value' : 'High Value'
    }
  };

  if (!currentUser) return null;

  // globalSearchQuery is extracted at the top to satisfy Rules of Hooks

  const filteredDeals = deals.filter(deal => {
    // Apply global search filter
    if (globalSearchQuery) {
      const q = globalSearchQuery.toLowerCase();
      if (!deal.title.toLowerCase().includes(q) &&
          !(deal.company?.name || '').toLowerCase().includes(q) &&
          !(deal.contact?.firstName || '').toLowerCase().includes(q)) {
        return false;
      }
    }

    if (activeFilter === 'my-deals') return deal.rep?.name === currentUser.name;
    if (activeFilter === 'stale') return deal.staleDays > 5 && deal.stage !== 'won' && deal.stage !== 'lost';
    if (activeFilter === 'high-value') return deal.amount >= 50000000;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto h-[calc(100vh-6rem)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t.title}</h1>
            <p className="text-sm text-text-muted mt-1">{t.subtitle}</p>
          </div>
          
          {/* Offline/Online Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isOnline ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? (syncQueue.length > 0 ? `Syncing (${syncQueue.length})...` : 'Online') : `Offline (Queue: ${syncQueue.length})`}
          </div>
        </div>
        
        <button 
          onClick={() => setIsNewDealOpen(true)}
          className="flex items-center gap-2 bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-medium shadow-sm shadow-brand/20 transition-all active:scale-95" 
          data-testid="btn-new-deal"
        >
          <Plus className="w-4 h-4" />
          {t.newDeal}
        </button>
      </div>

      {/* Preset Filter Chips with Framer Motion Layout */}
      <div className="flex items-center gap-2 shrink-0">
        {(['all', 'my-deals', 'stale', 'high-value'] as const).map(filter => (
          <button
            key={filter}
            data-testid={`preset-filter-${filter}`}
            onClick={() => {
              setActiveFilter(filter);
              toast.success(`Filter: ${filter}`);
            }}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === filter 
                ? 'text-base' 
                : 'bg-elevated text-text-secondary hover:text-text-primary hover:bg-border-divider/50 border border-border-divider'
            }`}
          >
            {activeFilter === filter && (
              <motion.div
                layoutId="active-filter-pill"
                className="absolute inset-0 bg-text-primary rounded-full -z-10 shadow-md"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {filter === 'all' && t.filters.all}
            {filter === 'my-deals' && t.filters.myDeals}
            {filter === 'stale' && t.filters.stale}
            {filter === 'high-value' && t.filters.highValue}
          </button>
        ))}
        {activeFilter !== 'all' && (
          <button 
            onClick={() => setActiveFilter('all')}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-danger px-2 transition-colors ml-2"
            title="Reset Filters (Ctrl+Shift+F)"
          >
            <FilterX className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          </div>
        ) : (
          <KanbanBoard deals={filteredDeals} onDealMove={handleDealMove} onDealClick={setInspectingDeal} />
        )}
      </div>

      {/* Poka-Yoke Modal */}
      <PokaYokeModal 
        isOpen={pokaYoke.isOpen}
        onClose={() => {
          setPokaYoke({ isOpen: false });
          toast.error(language === 'id' ? 'Pemindahan dibatalkan.' : 'Move cancelled.');
          mutate(); // Revert optimistic update
        }}
        onAutoFix={() => {
          if (pokaYoke.dealId && pokaYoke.targetStage) {
            // Auto fix sets staleDays to 0 virtually by just executing the move
            executeMove(pokaYoke.dealId, pokaYoke.targetStage);
            setPokaYoke({ isOpen: false });
          }
        }}
        title={language === 'id' ? 'Peringatan Operasional: Deal Usang (Stale)' : 'Operational Warning: Stale Deal'}
        description={language === 'id' 
          ? 'Deal ini sudah tidak aktif lebih dari 30 hari. Apakah Anda yakin ingin memindahkannya tanpa memperbarui catatan log terlebih dahulu? Klik Auto-Fix untuk otomatis me-reset timer usang dan memindahkan deal.'
          : 'This deal has been inactive for over 30 days. Are you sure you want to move it without updating the activity log first? Click Auto-Fix to reset the stale timer and proceed.'
        }
      />

      {/* Deal Inspector Modal */}
      <DealInspector deal={inspectingDeal} onClose={() => setInspectingDeal(null)} />
      
      {/* New Deal Modal */}
      <NewDealModal isOpen={isNewDealOpen} onClose={() => {
        setIsNewDealOpen(false);
        mutate(); // refresh list
      }} />
    </div>
  );
}
