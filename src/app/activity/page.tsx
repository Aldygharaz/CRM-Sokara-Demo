"use client";

import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { getActivities, getTasks, updateTaskStatus } from "../actions/activity";
import { CheckCircle2, Circle, Clock, Mail, Phone, Calendar, ArrowRight, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type Activity = Awaited<ReturnType<typeof getActivities>>[0];
type Task = Awaited<ReturnType<typeof getTasks>>[0];

export default function ActivityPage() {
  const { language, currentUser } = useStore();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(() => {
    if (!currentUser) return;
    setIsLoading(true);
    Promise.all([
      getActivities(currentUser.id, currentUser.role),
      getTasks(currentUser.id, currentUser.role)
    ]).then(([acts, tsks]) => {
      setActivities(acts);
      setTasks(tsks);
      setIsLoading(false);
    });
  }, [currentUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    
    // Optimistic Update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (e) {
      console.error(e);
      fetchData(); // Revert
    }
  };

  const t = {
    title: language === 'id' ? 'Aktivitas & Tugas' : 'Activity & Tasks',
    subtitle: language === 'id' ? 'Pantau semua komunikasi dan to-do list' : 'Monitor communications and to-do lists',
    tasksHeader: language === 'id' ? 'Tugas Saya' : 'My Tasks',
    timelineHeader: language === 'id' ? 'Linimasa Aktivitas' : 'Activity Timeline',
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'status_change': return <ArrowRight className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (!currentUser) return null;

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Timeline */}
          <div className="lg:col-span-2 card p-6 flex flex-col min-h-[500px]">
            <h3 className="font-semibold text-lg text-text-primary mb-6">{t.timelineHeader}</h3>
            
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="relative border-l border-border-divider ml-3 space-y-8">
                {activities.map((act, index) => (
                  <div 
                    key={act.id} 
                    className="relative pl-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
                    style={{ animationFillMode: "both", animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-3.5 top-1 w-7 h-7 rounded-full bg-elevated border border-border-divider flex items-center justify-center text-text-muted shrink-0 z-10 transition-colors hover:border-brand hover:text-brand">
                      {getActivityIcon(act.type)}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <img src={act.user.avatar || ""} alt={`${act.user.name} avatar`} className="w-6 h-6 rounded-full border border-border-divider" />
                        <span className="text-sm font-semibold text-text-primary">{act.user.name}</span>
                        <span className="text-xs text-text-muted">{new Date(act.date).toLocaleString()}</span>
                      </div>
                      
                      <div className="bg-canvas border border-border-divider rounded-xl p-4 text-sm text-text-secondary">
                        <p>{act.description}</p>
                        
                        {/* Context Pills */}
                        {(act.deal || act.contact || act.company) && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border-divider/50">
                            {act.deal && (
                              <span className="px-2 py-1 bg-brand/10 text-brand text-xs rounded-md font-medium">Deal: {act.deal.title}</span>
                            )}
                            {act.company && (
                              <span className="px-2 py-1 bg-elevated border border-border-divider text-text-secondary text-xs rounded-md font-medium">{act.company.name}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {activities.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-base border border-border-divider flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-text-muted" />
                    </div>
                    <h4 className="text-base font-semibold text-text-primary">
                      {language === 'id' ? 'Belum Ada Aktivitas' : 'No Activity Yet'}
                    </h4>
                    <p className="text-sm text-text-muted mt-1 max-w-sm">
                      {language === 'id' ? 'Riwayat komunikasi dan catatan akan muncul di sini.' : 'Communication history and notes will appear here.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="card p-6 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-text-primary">{t.tasksHeader}</h3>
            </div>
            
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-300",
                    task.status === 'done' 
                      ? "bg-canvas border-border-divider opacity-60" 
                      : "bg-elevated border-border-divider hover:border-brand/50 hover:shadow-md"
                  )}
                  style={{ animationFillMode: "both", animationDelay: `${index * 50}ms` }}
                  onClick={() => handleTaskToggle(task.id, task.status)}
                >
                  <button className="mt-0.5 text-text-muted group-hover:text-brand transition-colors shrink-0">
                    {task.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex flex-col gap-1">
                    <span className={cn("text-sm font-medium", task.status === 'done' ? "line-through text-text-muted" : "text-text-primary")}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-base border border-border-divider flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-text-muted" />
                  </div>
                  <h4 className="text-base font-semibold text-text-primary">
                    {language === 'id' ? 'Semua Beres!' : 'All Caught Up!'}
                  </h4>
                  <p className="text-sm text-text-muted mt-1 max-w-[200px] mx-auto">
                    {language === 'id' ? 'Tidak ada tugas yang tertunda.' : 'You have no pending tasks to complete.'}
                  </p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
