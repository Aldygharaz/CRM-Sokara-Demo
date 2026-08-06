"use client";

import { BarChart3, TrendingUp, Users, DollarSign, Activity as ActivityIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/store/useStore";
import { getDashboardStats } from "./actions/dashboard";
import InteractiveTiltCard from "@/components/ui/InteractiveTiltCard";
import SalesSimulator from "@/components/ui/SalesSimulator";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;

export default function Dashboard() {
  const { currentUser, language } = useStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await getDashboardStats(currentUser.id, currentUser.role);
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  if (!currentUser) return null;

  const t = {
    overview: language === 'id' ? 'Ringkasan' : 'Overview',
    subOverview: language === 'id' 
      ? `Berikut statistik penjualan untuk ${currentUser.role === 'VP' ? 'seluruh tim' : 'Anda'} hari ini.` 
      : `Here's what's happening with ${currentUser.role === 'VP' ? 'the team' : 'your'} deals today.`,
    revenue: language === 'id' ? 'Total Pendapatan' : 'Total Revenue',
    activeDeals: language === 'id' ? 'Deal Aktif' : 'Active Deals',
    newContacts: language === 'id' ? 'Kontak Baru' : 'New Contacts',
    winRate: language === 'id' ? 'Rasio Kemenangan' : 'Win Rate',
    recentActivity: language === 'id' ? 'Aktivitas Terbaru' : 'Recent Activity',
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const pipelineData = stats?.pipelineByStage.map(s => ({
    name: s.stage.charAt(0).toUpperCase() + s.stage.slice(1),
    value: s._sum.amount || 0
  })) || [];

  const STAGE_COLORS: Record<string, string> = {
    'New': '#3b82f6', // blue
    'Contacted': '#8b5cf6', // purple
    'Proposal': '#f59e0b', // amber
    'Negotiation': '#f97316', // orange
    'Won': '#10b981', // emerald
    'Lost': '#ef4444' // red
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{t.overview}</h1>
          <p className="text-sm text-text-muted mt-1">{t.subOverview}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: t.revenue, value: formatCurrency(stats?.revenue || 0), icon: DollarSign, trend: "+12.5%", positive: true },
              { title: t.activeDeals, value: stats?.activeDeals || 0, icon: BarChart3, trend: "+3", positive: true },
              { title: t.newContacts, value: stats?.newContacts || 0, icon: Users, trend: "+22%", positive: true },
              { title: t.winRate, value: `${stats?.winRate || 0}%`, icon: TrendingUp, trend: "-2%", positive: false },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationFillMode: "both", animationDelay: `${i * 100}ms` }}
              >
                <InteractiveTiltCard className="card p-5 flex flex-col gap-4 relative group h-full" spotlightColor={stat.positive ? 'rgba(52, 199, 89, 0.12)' : 'rgba(255, 59, 48, 0.12)'}>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-sm font-medium text-text-muted">{stat.title}</span>
                    <div className="w-8 h-8 rounded-md bg-brand/10 text-brand flex items-center justify-center">
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="z-10">
                    <span className="text-3xl font-bold text-text-primary truncate block">{stat.value}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${stat.positive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-xs text-text-muted">vs last month</span>
                    </div>
                  </div>
                </InteractiveTiltCard>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div 
              className="lg:col-span-2 animate-in fade-in slide-in-from-bottom-4 duration-500" 
              style={{ animationFillMode: "both", animationDelay: "400ms" }}
            >
              <InteractiveTiltCard className="card p-5 flex flex-col min-h-[400px] h-full">
                <h3 className="font-semibold text-text-primary mb-6 z-10">Pipeline by Stage</h3>
                <div className="flex-1 w-full h-full min-h-[300px] z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pipelineData} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-divider)" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} dy={10} />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} 
                        tickFormatter={(val) => `Rp ${val / 1000000}M`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--color-brand)', opacity: 0.05 }}
                        contentStyle={{ backgroundColor: 'var(--color-base)', border: '1px solid var(--color-border-divider)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Value']}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500} animationEasing="ease-out">
                        {pipelineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.name] || 'var(--color-brand)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </InteractiveTiltCard>
            </div>

            <div 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationFillMode: "both", animationDelay: "500ms" }}
            >
              <SalesSimulator 
                currentPipelineValue={stats?.revenue || 0}
                currentWinRate={stats?.winRate || 0}
                activeDealsCount={stats?.activeDeals || 0}
              />
            </div>
          </div>

          <div 
            className="mt-6 grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationFillMode: "both", animationDelay: "600ms" }}
          >
            <InteractiveTiltCard className="card p-5 flex flex-col min-h-[300px]">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2 z-10">
                <ActivityIcon className="w-4 h-4 text-brand" />
                {t.recentActivity}
              </h3>
              <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 z-10">
                {stats?.recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-3 items-start group">
                    <img src={act.user.avatar || ""} alt="" className="w-8 h-8 rounded-full border border-border-divider mt-1 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <div className="text-sm text-text-primary leading-snug">
                        <span className="font-semibold">{act.user.name}</span> {act.description}
                      </div>
                      <span className="text-xs text-text-muted">{new Date(act.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {stats?.recentActivities.length === 0 && (
                  <div className="text-sm text-text-muted text-center mt-10">No recent activity</div>
                )}
              </div>
            </InteractiveTiltCard>
          </div>
        </>
      )}
    </div>
  );
}
