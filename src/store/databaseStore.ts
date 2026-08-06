import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Data types based on our old Prisma schema
export type DealStage = 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type ActivityType = 'call' | 'email' | 'meeting' | 'status_change';
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  website: string;
  logo?: string | null;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobTitle: string | null;
  companyId: string;
  source: string;
}

export interface Deal {
  id: string;
  title: string;
  initialValue: number;
  amount: number;
  stage: DealStage;
  source: string;
  winProbability: number;
  staleDays: number;
  repId: string;
  companyId: string;
  contactId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  userId: string;
  dealId?: string;
  contactId?: string;
  companyId?: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string | null;
  status: TaskStatus;
  assigneeId: string;
  dealId?: string;
}

export interface DatabaseState {
  users: User[];
  companies: Company[];
  contacts: Contact[];
  deals: Deal[];
  activities: Activity[];
  tasks: Task[];

  // Mutations
  setUsers: (users: User[]) => void;
  setCompanies: (companies: Company[]) => void;
  setContacts: (contacts: Contact[]) => void;
  setDeals: (deals: Deal[]) => void;
  setActivities: (activities: Activity[]) => void;
  setTasks: (tasks: Task[]) => void;
  
  // Helpers
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  addDeal: (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'staleDays'>) => void;
  updateDealStage: (dealId: string, stage: DealStage) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;

  resetToDefault: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

// The exact seed data from Prisma seed
const seedData = () => {
  const alex: User = { id: 'cmc8xy3v20000abc123', name: 'Alex Mercer', email: 'alex@sokara.id', role: 'VP', avatar: 'https://ui-avatars.com/api/?name=Alex+Mercer&background=3b82f6&color=fff' };
  const sarah: User = { id: 'cmc8xy3v20001def456', name: 'Sarah Connor', email: 'sarah@sokara.id', role: 'REP', avatar: 'https://ui-avatars.com/api/?name=Sarah+Connor&background=10b981&color=fff' };

  const ptMaju: Company = { id: 'c1', name: 'PT Maju Bersama', industry: 'Manufacturing', size: 'Enterprise', website: 'www.majubersama.co.id' };
  const techFlow: Company = { id: 'c2', name: 'TechFlow Indonesia', industry: 'Technology', size: 'Mid-Market', website: 'www.techflow.id' };
  const goTech: Company = { id: 'c3', name: 'GoTech Solutions', industry: 'Technology', size: 'Enterprise', website: 'www.gotech.id' };
  const indomar: Company = { id: 'c4', name: 'Indomar Retail', industry: 'Retail', size: 'Enterprise', website: 'www.indomar.co.id' };

  const budi: Contact = { id: 'ct1', firstName: 'Budi', lastName: 'Santoso', email: 'budi@majubersama.co.id', phone: '+6281234567890', jobTitle: 'Procurement Director', companyId: ptMaju.id, source: 'Inbound' };
  const andi: Contact = { id: 'ct2', firstName: 'Andi', lastName: 'Wijaya', email: 'andi@techflow.id', phone: '+6281987654321', jobTitle: 'CTO', companyId: techFlow.id, source: 'Referral' };
  const rina: Contact = { id: 'ct3', firstName: 'Rina', lastName: 'Melati', email: 'rina@gotech.id', phone: '+628111222333', jobTitle: 'VP Engineering', companyId: goTech.id, source: 'Outbound' };
  const joko: Contact = { id: 'ct4', firstName: 'Joko', lastName: 'Anwar', email: 'joko@indomar.co.id', phone: '+628999888777', jobTitle: 'Operations Manager', companyId: indomar.id, source: 'Inbound' };

  const now = new Date().toISOString();
  
  const deals: Deal[] = [
    { id: 'd1', title: 'Enterprise ERP Implementation', initialValue: 150000000, amount: 140000000, stage: 'negotiation', source: 'Inbound', winProbability: 80, staleDays: 2, repId: alex.id, companyId: ptMaju.id, contactId: budi.id, createdAt: now, updatedAt: now },
    { id: 'd2', title: 'Cloud Infrastructure Upgrade', initialValue: 85000000, amount: 85000000, stage: 'proposal', source: 'Referral', winProbability: 50, staleDays: 6, repId: sarah.id, companyId: techFlow.id, contactId: andi.id, createdAt: now, updatedAt: now },
    { id: 'd3', title: 'POS System Rollout 100 Stores', initialValue: 500000000, amount: 450000000, stage: 'contacted', source: 'Outbound', winProbability: 20, staleDays: 1, repId: sarah.id, companyId: indomar.id, contactId: joko.id, createdAt: now, updatedAt: now },
    { id: 'd4', title: 'SaaS License Renewal 2026', initialValue: 120000000, amount: 120000000, stage: 'new', source: 'Referral', winProbability: 90, staleDays: 0, repId: alex.id, companyId: goTech.id, contactId: rina.id, createdAt: now, updatedAt: now },
    { id: 'd5', title: 'Data Center Migration Phase 1', initialValue: 300000000, amount: 320000000, stage: 'won', source: 'Inbound', winProbability: 100, staleDays: 12, repId: alex.id, companyId: techFlow.id, contactId: andi.id, createdAt: now, updatedAt: now },
    { id: 'd6', title: 'Security Audit & Compliance', initialValue: 75000000, amount: 75000000, stage: 'proposal', source: 'Referral', winProbability: 60, staleDays: 3, repId: alex.id, companyId: ptMaju.id, contactId: budi.id, createdAt: now, updatedAt: now },
    { id: 'd7', title: 'Custom Mobile App Dev', initialValue: 200000000, amount: 210000000, stage: 'negotiation', source: 'Inbound', winProbability: 40, staleDays: 1, repId: sarah.id, companyId: indomar.id, contactId: joko.id, createdAt: now, updatedAt: now },
    { id: 'd8', title: 'AI Chatbot Integration', initialValue: 45000000, amount: 45000000, stage: 'new', source: 'Outbound', winProbability: 15, staleDays: 0, repId: alex.id, companyId: techFlow.id, contactId: andi.id, createdAt: now, updatedAt: now },
    { id: 'd9', title: 'Warehouse Management System', initialValue: 350000000, amount: 330000000, stage: 'contacted', source: 'Referral', winProbability: 25, staleDays: 8, repId: sarah.id, companyId: ptMaju.id, contactId: budi.id, createdAt: now, updatedAt: now },
    { id: 'd10', title: 'Q3 Maintenance Contract', initialValue: 50000000, amount: 50000000, stage: 'negotiation', source: 'Inbound', winProbability: 85, staleDays: 4, repId: alex.id, companyId: goTech.id, contactId: rina.id, createdAt: now, updatedAt: now },
  ];

  const activities: Activity[] = [
    { id: 'a1', type: 'meeting', description: 'Initial discovery call to discuss ERP requirements.', userId: alex.id, dealId: deals[0].id, companyId: ptMaju.id, contactId: budi.id, date: now },
    { id: 'a2', type: 'call', description: 'Followed up on the POS system rollout. Waiting for CEO approval.', userId: sarah.id, dealId: deals[2].id, companyId: indomar.id, contactId: joko.id, date: now },
    { id: 'a3', type: 'status_change', description: 'Moved Data Center Migration to WON!', userId: alex.id, dealId: deals[4].id, companyId: techFlow.id, date: now },
  ];

  const future = new Date();
  future.setDate(future.getDate() + 2);
  
  const tasks: Task[] = [
    { id: 't1', title: 'Send Revised Proposal for ERP', dueDate: future.toISOString(), status: 'todo', assigneeId: alex.id, dealId: deals[0].id },
    { id: 't2', title: 'Prepare Demo for Indomar POS', dueDate: future.toISOString(), status: 'in_progress', assigneeId: sarah.id, dealId: deals[2].id },
    { id: 't3', title: 'Sign NDA with GoTech', dueDate: now, status: 'done', assigneeId: alex.id, dealId: deals[3].id },
  ];

  return { users: [alex, sarah], companies: [ptMaju, techFlow, goTech, indomar], contacts: [budi, andi, rina, joko], deals, activities, tasks };
};

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set) => ({
      ...seedData(),

      setUsers: (users) => set({ users }),
      setCompanies: (companies) => set({ companies }),
      setContacts: (contacts) => set({ contacts }),
      setDeals: (deals) => set({ deals }),
      setActivities: (activities) => set({ activities }),
      setTasks: (tasks) => set({ tasks }),

      addActivity: (activityData) => {
        const newActivity: Activity = {
          ...activityData,
          id: generateId(),
          date: new Date().toISOString(),
        };
        set((state) => ({ activities: [newActivity, ...state.activities] }));
      },

      addDeal: (dealData) => {
        set((state) => ({
          deals: [{
            ...dealData,
            id: `d${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            staleDays: 0,
            winProbability: dealData.winProbability || 10,
          }, ...state.deals]
        }));
      },

      updateDealStage: (dealId, stage) => {
        set((state) => {
          const deal = state.deals.find((d) => d.id === dealId);
          if (deal && deal.stage !== stage) {
            const activities = [...state.activities];
            activities.unshift({
              id: generateId(),
              type: 'status_change',
              description: `Moved deal to ${stage.toUpperCase()}`,
              userId: deal.repId,
              dealId: deal.id,
              companyId: deal.companyId,
              date: new Date().toISOString(),
            });
            return {
              deals: state.deals.map((d) => d.id === dealId ? { ...d, stage, updatedAt: new Date().toISOString() } : d),
              activities
            };
          }
          return state;
        });
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status } : t)
        }));
      },

      resetToDefault: () => {
        set(seedData());
      }
    }),
    {
      name: 'sokara-crm-db',
    }
  )
);
