"use client";

import React from 'react';
import { AlertTriangle, Sparkles, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface PokaYokeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoFix: () => void;
  title: string;
  description: string;
}

export default function PokaYokeModal({ isOpen, onClose, onAutoFix, title, description }: PokaYokeModalProps) {
  const { language } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-elevated border border-warning/30 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-warning/10 p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 pt-1">
            <h3 className="font-bold text-text-primary text-lg leading-tight">{title}</h3>
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        
        <div className="p-4 bg-canvas flex flex-col gap-3">
          <button 
            onClick={() => {
              onAutoFix();
              onClose();
            }}
            className="group relative w-full py-3 bg-gradient-to-r from-brand to-purple-500 hover:from-brand-hover hover:to-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 active:scale-95 overflow-hidden"
            data-testid="poka-yoke-autofix"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            <Sparkles className="w-4 h-4 animate-pulse relative z-10" />
            <span className="relative z-10">
              {language === 'id' ? '✨ Auto-Fix (Selesaikan Otomatis)' : '✨ Auto-Fix (Resolve Automatically)'}
            </span>
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-2.5 text-text-muted hover:text-text-primary font-medium text-sm transition-colors"
          >
            {language === 'id' ? 'Abaikan & Lanjutkan' : 'Ignore & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
