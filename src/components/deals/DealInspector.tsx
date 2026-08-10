"use client";

import { useEffect, useState } from "react";
import { X, Mail, Send, Calendar, Phone, Activity } from "lucide-react";
import { Deal } from "./KanbanBoard";
import { getDealActivities, addActivity } from "@/app/actions/activity";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveTiltCard from "@/components/ui/InteractiveTiltCard";

type DealActivity = Awaited<ReturnType<typeof getDealActivities>>[0];

export function DealInspector({ deal, onClose }: { deal: Deal | null, onClose: () => void }) {
  const { currentUser, language } = useStore();
  const [activities, setActivities] = useState<DealActivity[]>([]);
  const [emailBody, setEmailBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (deal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      getDealActivities(deal.id).then(data => {
        setActivities(data);
        setIsLoading(false);
      });
    }
  }, [deal]);

  const handleSendEmail = async () => {
    if (!emailBody.trim() || !currentUser || !deal) return;
    setIsSending(true);
    
    // Simulate sending email and then log activity
    await addActivity('email', `Sent email: "${emailBody}"`, currentUser.id, deal.id, deal.contact?.firstName ? deal.contact.firstName : undefined, deal.company?.name ? deal.company.name : undefined);
    
    const newActs = await getDealActivities(deal.id);
    setActivities(newActs);
    setEmailBody("");
    setIsSending(false);
  };

  const t = {
    about: language === 'id' ? 'Tentang Deal' : 'About Deal',
    timeline: language === 'id' ? 'Aktivitas & Email' : 'Activity & Email',
    sendEmail: language === 'id' ? 'Kirim Email' : 'Send Email',
    emailPlaceholder: language === 'id' ? 'Tulis email untuk prospek...' : 'Write an email to the prospect...',
  };

  return (
    <AnimatePresence>
      {deal && (
        <motion.div key="deal-inspector" className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Slide-over Panel */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-canvas border-l border-border-divider h-full shadow-2xl flex flex-col"
          >
        
        {/* Header */}
        <div className="p-6 border-b border-border-divider flex items-center justify-between bg-elevated shrink-0">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">{deal.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-semibold rounded-md">
                Rp {deal.amount.toLocaleString('id-ID')}
              </span>
              <span className="px-2 py-1 bg-canvas border border-border-divider text-text-secondary text-xs rounded-md uppercase tracking-wider">
                {deal.stage}
              </span>
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
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
          
          {/* Deal Metadata */}
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t.about}</h3>
            
            <InteractiveTiltCard className="bg-elevated border border-border-divider rounded-xl p-4 flex flex-col gap-3 cursor-default">
              {deal.company && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-muted">Company</span>
                  <span className="font-medium text-text-primary">{deal.company.name}</span>
                </div>
              )}
              {deal.contact && (
                <div className="flex justify-between items-center text-sm pt-3 border-t border-border-divider/50">
                  <span className="text-text-muted">Contact</span>
                  <span className="font-medium text-text-primary">{deal.contact.firstName} {deal.contact.lastName}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm pt-3 border-t border-border-divider/50">
                <span className="text-text-muted">Probability</span>
                <span className="font-medium text-text-primary">{deal.winProbability}%</span>
              </div>
            </InteractiveTiltCard>
          </section>

          {/* Activity & Email Composer */}
          <section className="flex flex-col gap-4 flex-1">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">{t.timeline}</h3>
            
            {/* Email Composer (Mock) */}
            <div className="bg-elevated border border-border-divider rounded-xl overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full min-h-[100px] p-4 bg-transparent resize-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <div className="bg-canvas/50 p-2 border-t border-border-divider flex justify-between items-center">
                <div className="flex items-center gap-1 text-text-muted">
                  <button className="p-1.5 hover:text-text-primary hover:bg-hover rounded-md transition-colors"><Mail className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:text-text-primary hover:bg-hover rounded-md transition-colors"><Phone className="w-4 h-4" /></button>
                  <button className="p-1.5 hover:text-text-primary hover:bg-hover rounded-md transition-colors"><Calendar className="w-4 h-4" /></button>
                </div>
                <button 
                  onClick={handleSendEmail}
                  disabled={!emailBody.trim() || isSending}
                  className="bg-brand text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-brand-hover disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSending ? '...' : t.sendEmail}
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 border-l border-border-divider ml-3 space-y-6">
              {isLoading && <div className="pl-6 text-sm text-text-muted">Loading...</div>}
              {!isLoading && activities.map(act => (
                <div key={act.id} className="relative pl-6">
                  <div className="absolute -left-2.5 top-0.5 w-5 h-5 rounded-full bg-elevated border border-border-divider flex items-center justify-center text-text-muted z-10">
                    <Activity className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-text-primary">{act.user.name}</span>
                      <span className="text-xs text-text-muted">{new Date(act.date).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-text-secondary bg-elevated border border-border-divider p-3 rounded-lg inline-block">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </section>
        </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
