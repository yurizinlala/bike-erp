export type RevisionStatus = 'ok' | 'due' | 'overdue' | 'scheduled';

export interface PurchaseHistory {
  id: string;
  productName: string;
  date: string; // ISO Date
  value: number;
}

export interface ServiceItem {
  description: string;
  cost: number;
}

export interface RevisionHistory {
  id: string;
  date: string; // ISO Date
  description: string;
  cost: number;
  mechanic?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  birthDate: string; // MM-DD
  notes?: string;
  address?: string;

  // Histories
  purchases: PurchaseHistory[];
  revisions: RevisionHistory[];

  // Computed/Active State
  lastPurchaseDate?: string;
  daysSinceLastPurchase?: number;
  nextRevisionDate?: string; // Estimated or Scheduled
  revisionStatus?: RevisionStatus; // For visual indicators
  isScheduled?: boolean;
  scheduledDate?: string;
}

export interface DashboardStats {
  salesToday: number;
  financialToday: number;
  birthdaysCount: number;
  pendingCount: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  minStock: number;
  location: string;
}

export type OrderStatus = 'new' | 'prep' | 'payment' | 'done';

export interface Order {
  id: string;
  clientName: string;
  type: 'Venda' | 'Serviço';
  status: OrderStatus;
  value: number;
  date: string;
}

export interface Pendency {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning';
  date: string;
}

