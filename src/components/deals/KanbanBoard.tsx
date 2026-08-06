"use client";

import { useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Building2, UserCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import InteractiveTiltCard from "@/components/ui/InteractiveTiltCard";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export type Deal = {
  id: string;
  title: string;
  amount: number;
  stage: string;
  winProbability: number;
  staleDays: number;
  company?: { name: string; logo: string | null } | null;
  contact?: { firstName: string; lastName: string } | null;
  rep?: { name: string; avatar: string | null } | null;
};

const STAGES = [
  { id: 'new', title: 'New Lead' },
  { id: 'contacted', title: 'Contacted' },
  { id: 'proposal', title: 'Proposal' },
  { id: 'negotiation', title: 'Negotiation' },
  { id: 'won', title: 'Won' },
  { id: 'lost', title: 'Lost' },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
}

// Draggable Deal Card
function DealCard({ deal, isDragging, onClick }: { deal: Deal; isDragging?: boolean; onClick?: () => void }) {
  const isStale = deal.staleDays > 5 && deal.stage !== 'won' && deal.stage !== 'lost';
  
  return (
    <InteractiveTiltCard
      onClick={onClick}
      className={cn(
        "bg-elevated border rounded-xl p-4 flex flex-col gap-3 cursor-pointer",
        isDragging ? "opacity-90 border-brand shadow-[0_10px_40px_rgba(0,122,255,0.2)] scale-105 z-50 ring-2 ring-brand/50" : "border-border-divider shadow-sm hover:border-border-input hover:shadow-md",
        isStale && !isDragging && "border-danger/30 bg-danger/5"
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-semibold text-text-primary text-sm leading-tight">{deal.title}</h4>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md border shrink-0 transition-colors",
          deal.stage === 'won' ? "bg-success/15 border-success/30 text-success" : 
          deal.stage === 'lost' ? "bg-danger/15 border-danger/30 text-danger" : 
          "bg-canvas border-border-divider text-text-primary"
        )}>
           {deal.stage === 'won' ? <TrendingUp className="w-3 h-3 text-success" /> : 
            deal.stage === 'lost' ? <TrendingDown className="w-3 h-3 text-danger" /> :
            <DollarSign className="w-3 h-3 text-brand" />}
           <span className="text-xs font-bold">{formatCurrency(deal.amount)}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 mt-1">
        {deal.company && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
             <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
             <span className="truncate">{deal.company.name}</span>
          </div>
        )}
        {deal.contact && (
          <div className="flex items-center gap-2 text-xs text-text-secondary">
             <UserCircle className="w-3.5 h-3.5 text-text-muted shrink-0" />
             <span className="truncate">{deal.contact.firstName} {deal.contact.lastName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-divider/50">
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-2 h-2 rounded-full",
            deal.winProbability >= 70 ? "bg-success" : deal.winProbability >= 30 ? "bg-warning" : "bg-danger"
          )} />
          <span className="text-xs text-text-muted font-medium">{deal.winProbability}% Win</span>
        </div>
        
        {deal.rep && (
           <img src={deal.rep.avatar || ""} alt="" className="w-5 h-5 rounded-full border border-border-divider" title={deal.rep.name} />
        )}
      </div>
    </InteractiveTiltCard>
  );
}

// Sortable Wrapper
function SortableDealCard({ deal, onClick }: { deal: Deal; onClick?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id, data: { type: 'Deal', deal } });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none cursor-grab active:cursor-grabbing">
      <DealCard deal={deal} isDragging={isDragging} onClick={onClick} />
    </div>
  );
}

// Droppable Column Wrapper
function DroppableColumn({ stage, stageDeals, stageTotal, onDealClick, index }: { stage: typeof STAGES[0], stageDeals: Deal[], stageTotal: number, onDealClick?: (deal: Deal) => void, index: number }) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: { type: 'Stage', stage }
  });

  return (
    <div 
      className="flex flex-col flex-shrink-0 w-80 bg-base rounded-2xl border border-border-divider overflow-hidden h-full animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationFillMode: "both", animationDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border-divider bg-canvas/50">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-text-primary uppercase tracking-wider text-xs">{stage.title}</h3>
          <span className="text-xs font-medium bg-elevated px-2 py-0.5 rounded-full text-text-muted">
            {stageDeals.length}
          </span>
        </div>
        <div className={cn(
          "text-sm font-semibold",
          stage.id === 'won' ? "text-success" : 
          stage.id === 'lost' ? "text-danger" : 
          "text-text-secondary"
        )}>
          {formatCurrency(stageTotal)}
        </div>
      </div>
      
      {/* Drop Zone (Attach droppable ref here) */}
      <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[150px]">
        <SortableContext id={stage.id} items={stageDeals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3 min-h-full">
            {stageDeals.map(deal => (
              <SortableDealCard key={deal.id} deal={deal} onClick={() => onDealClick?.(deal)} />
            ))}
            {stageDeals.length === 0 && (
              <div className="flex-1 min-h-[100px] border-2 border-dashed border-brand/40 animate-pulse rounded-xl flex items-center justify-center text-xs text-brand font-medium bg-brand/5 pointer-events-none">
                Drop deals here
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  deals: Deal[];
  onDealMove: (dealId: string, newStage: string) => void;
  onDealClick?: (deal: Deal) => void;
}

export function KanbanBoard({ deals, onDealMove, onDealClick }: KanbanBoardProps) {
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    if (deal) setActiveDeal(deal);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    
    if (!over) return;

    const dealId = active.id as string;
    const overId = over.id as string;

    const overStageId = STAGES.find(s => s.id === overId)?.id || deals.find(d => d.id === overId)?.stage;
    const deal = deals.find(d => d.id === dealId);

    if (deal && overStageId && deal.stage !== overStageId) {
      onDealMove(dealId, overStageId);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {STAGES.map((stage, index) => {
          const stageDeals = deals.filter(d => d.stage === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

          return (
            <DroppableColumn 
              key={stage.id} 
              stage={stage} 
              stageDeals={stageDeals} 
              stageTotal={stageTotal} 
              onDealClick={onDealClick} 
              index={index} 
            />
          );
        })}
      </div>

      {/* Drag Overlay for smooth animation */}
      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
