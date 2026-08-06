import { useDatabaseStore, ActivityType, TaskStatus } from "@/store/databaseStore";

export async function addActivity(
  type: ActivityType,
  description: string,
  userId: string,
  dealId?: string,
  contactId?: string,
  companyId?: string
) {
  useDatabaseStore.getState().addActivity({
    type,
    description,
    userId,
    dealId,
    contactId,
    companyId
  });
  return { success: true };
}

export async function getDealActivities(dealId: string) {
  const { activities, users } = useDatabaseStore.getState();
  
  const dealActs = activities.filter(a => a.dealId === dealId);
  return dealActs.map(act => ({
    ...act,
    user: users.find(u => u.id === act.userId) || { id: '0', name: 'Unknown', avatar: null }
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getActivities(userId: string, role: string) {
  const { activities, users, deals, companies, contacts } = useDatabaseStore.getState();
  
  let visibleActivities = activities;
  if (role !== 'VP') {
    visibleActivities = activities.filter(a => a.userId === userId);
  }

  return visibleActivities.map(act => ({
    ...act,
    user: users.find(u => u.id === act.userId) || { id: '0', name: 'Unknown', avatar: null },
    deal: deals.find(d => d.id === act.dealId) || null,
    company: companies.find(c => c.id === act.companyId) || null,
    contact: contacts.find(c => c.id === act.contactId) || null,
  })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTasks(userId: string, role: string) {
  const { tasks } = useDatabaseStore.getState();
  
  let visibleTasks = tasks;
  if (role !== 'VP') {
    visibleTasks = tasks.filter(t => t.assigneeId === userId);
  }

  return visibleTasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  useDatabaseStore.getState().updateTaskStatus(taskId, status);
  return { success: true };
}
