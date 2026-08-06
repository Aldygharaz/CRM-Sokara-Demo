import { useDatabaseStore } from "@/store/databaseStore";

export async function getDashboardStats(userId: string, role: string) {
  const { deals } = useDatabaseStore.getState();
  let visibleDeals = deals;
  
  if (role !== 'VP') {
    visibleDeals = deals.filter(d => d.repId === userId);
  }

  const pipelineValue = visibleDeals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, deal) => sum + deal.amount, 0);

  const wonDeals = visibleDeals.filter(d => d.stage === 'won');
  const totalClosedDeals = visibleDeals.filter(d => d.stage === 'won' || d.stage === 'lost');
  
  const winRate = totalClosedDeals.length > 0 
    ? Math.round((wonDeals.length / totalClosedDeals.length) * 100) 
    : 0;

  const quotaTarget = 1000000000; // 1B IDR
  const achieved = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);

  const stages = ['new', 'contacted', 'proposal', 'negotiation'];
  const pipelineByStage = stages.map(stage => {
    const stageDeals = visibleDeals.filter(d => d.stage === stage);
    return {
      stage,
      _sum: { amount: stageDeals.reduce((sum, d) => sum + d.amount, 0) }
    };
  });

  const revenue = achieved;
  const activeDeals = visibleDeals.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
  const newContacts = 15; // Mock data since we don't track contact creation date in this demo

  const { activities, users, contacts, companies } = useDatabaseStore.getState();
  const recentActivities = activities
    .slice(0, 5)
    .map(act => ({
      ...act,
      user: users.find(u => u.id === act.userId) || { id: '0', name: 'Unknown', avatar: null },
      deal: deals.find(d => d.id === act.dealId) || null,
      company: companies.find(c => c.id === act.companyId) || null,
      contact: contacts.find(c => c.id === act.contactId) || null,
    }));

  return {
    pipelineValue,
    winRate,
    quota: {
      target: quotaTarget,
      achieved,
    },
    pipelineByStage,
    revenue,
    activeDeals,
    newContacts,
    recentActivities
  };
}
