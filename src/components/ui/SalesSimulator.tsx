"use client";

import React, { useState } from 'react';
import InteractiveTiltCard from './InteractiveTiltCard';
import { Calculator, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface SalesSimulatorProps {
  currentPipelineValue: number;
  currentWinRate: number;
  activeDealsCount: number;
}

export default function SalesSimulator({ currentPipelineValue, currentWinRate, activeDealsCount }: SalesSimulatorProps) {
  const { language } = useStore();
  
  const [winRateBoost, setWinRateBoost] = useState(0);
  const [dealSizeBoost, setDealSizeBoost] = useState(0);
  
  const currentAvgDealSize = activeDealsCount > 0 ? currentPipelineValue / activeDealsCount : 0;
  
  const simulatedWinRate = Math.min(100, Math.max(0, currentWinRate + winRateBoost));
  const simulatedDealSize = currentAvgDealSize * (1 + dealSizeBoost / 100);
  
  const simulatedRevenue = activeDealsCount * simulatedDealSize * (simulatedWinRate / 100);
  const currentRevenue = currentPipelineValue * (currentWinRate / 100);
  
  const revenueDifference = simulatedRevenue - currentRevenue;
  
  const t = {
    title: language === 'id' ? 'Simulator Strategi Sales' : 'Sales Strategy Simulator',
    subtitle: language === 'id' ? 'Simulasikan "What-If" skenario untuk target Q3' : 'Simulate "What-If" scenarios for Q3 targets',
    winRate: language === 'id' ? 'Peningkatan Win Rate' : 'Win Rate Boost',
    dealSize: language === 'id' ? 'Peningkatan Ukuran Deal' : 'Deal Size Boost',
    predicted: language === 'id' ? 'Prediksi Pendapatan' : 'Predicted Revenue',
    difference: language === 'id' ? 'Selisih' : 'Difference',
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <InteractiveTiltCard className="card p-5 flex flex-col min-h-[400px] relative overflow-hidden" spotlightColor="rgba(139, 92, 246, 0.15)">
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="z-10 flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-text-primary flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand" />
            {t.title}
          </h3>
          <p className="text-xs text-text-muted mt-1">{t.subtitle}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-brand" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between z-10 gap-6">
        <div className="space-y-6">
          {/* Win Rate Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-text-primary">{t.winRate}</label>
              <span className="text-sm font-bold text-brand">{winRateBoost > 0 ? '+' : ''}{winRateBoost}%</span>
            </div>
            <input 
              type="range" 
              min="-20" max="50" step="5"
              value={winRateBoost}
              onChange={(e) => setWinRateBoost(parseInt(e.target.value))}
              className="w-full accent-brand bg-border-divider/50 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Dasar: {currentWinRate}%</span>
              <span>Simulasi: {simulatedWinRate}%</span>
            </div>
          </div>

          {/* Deal Size Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-text-primary">{t.dealSize}</label>
              <span className="text-sm font-bold text-purple-500">{dealSizeBoost > 0 ? '+' : ''}{dealSizeBoost}%</span>
            </div>
            <input 
              type="range" 
              min="-20" max="100" step="10"
              value={dealSizeBoost}
              onChange={(e) => setDealSizeBoost(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-border-divider/50 h-2 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>Dasar: {formatCurrency(currentAvgDealSize)}</span>
              <span>Simulasi: {formatCurrency(simulatedDealSize)}</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-base p-4 rounded-xl border border-border-divider shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 text-center space-y-1">
            <div className="text-xs text-text-muted uppercase tracking-wider font-semibold">{t.predicted}</div>
            <div className="text-2xl font-bold text-text-primary">
              {formatCurrency(simulatedRevenue)}
            </div>
            <div className={`text-sm font-medium ${revenueDifference >= 0 ? 'text-success' : 'text-danger'}`}>
              {revenueDifference >= 0 ? '+' : ''}{formatCurrency(revenueDifference)} {t.difference}
            </div>
          </div>
        </div>
      </div>
    </InteractiveTiltCard>
  );
}
