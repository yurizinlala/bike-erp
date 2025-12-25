import { Client, DashboardStats } from "@/types";

export const MOCK_STATS: DashboardStats = {
    salesToday: 4,
    financialToday: 12500.00,
    birthdaysCount: 2,
    pendingCount: 5,
};

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
    date: string; // Due date or creation date
}

export const MOCK_PRODUCTS: Product[] = [
    { id: 'p1', name: 'E-Bike Sport 500W', price: 8500, category: 'Bicicleta', quantity: 3, minStock: 2, location: 'Loja Principal' },
    { id: 'p2', name: 'E-Bike City', price: 6200, category: 'Bicicleta', quantity: 1, minStock: 2, location: 'Loja Principal' }, // Low Stock
    { id: 'p3', name: 'E-Bike Cargo', price: 9000, category: 'Bicicleta', quantity: 0, minStock: 1, location: 'Depósito' }, // Out of Stock
    { id: 'p4', name: 'E-Bike Foldable', price: 5500, category: 'Bicicleta', quantity: 5, minStock: 2, location: 'Vitrine' },
    { id: 'a1', name: 'Bateria Extra 48V', price: 2500, category: 'Acessório', quantity: 4, minStock: 5, location: 'Prateleira A' }, // Low Stock
    { id: 'a2', name: 'Capacete Pro', price: 250, category: 'Acessório', quantity: 15, minStock: 5, location: 'Prateleira B' },
    { id: 'a3', name: 'Cadeado U-Lock', price: 180, category: 'Acessório', quantity: 8, minStock: 3, location: 'Prateleira B' },
    { id: 'p_brake', name: 'Pastilha de Freio', price: 45, category: 'Peça', quantity: 22, minStock: 10, location: 'Gaveta 3' },
    { id: 'p_tire', name: 'Pneu Aro 26', price: 120, category: 'Peça', quantity: 2, minStock: 4, location: 'Estoque Fundos' }, // Low Stock
];

export const MOCK_ORDERS: Order[] = [
    { id: 'ord-101', clientName: 'Roberto Silva', type: 'Venda', status: 'new', value: 8750, date: '2025-12-23' },
    { id: 'ord-102', clientName: 'Julia Mendes', type: 'Serviço', status: 'prep', value: 350, date: '2025-12-22' },
    { id: 'ord-103', clientName: 'Carlos Oliveira', type: 'Serviço', status: 'payment', value: 80, date: '2025-12-20' },
    { id: 'ord-104', clientName: 'Condomínio Solar', type: 'Venda', status: 'new', value: 18000, date: '2025-12-23' },
    { id: 'ord-105', clientName: 'Ana Clara', type: 'Serviço', status: 'done', value: 120, date: '2025-12-18' },
];

export const MOCK_PENDENCIES: Pendency[] = [
    { id: 'pen-1', title: 'Aluguel Atrasado', description: 'Cliente João não pagou a mensalidade de Dezembro.', severity: 'critical', date: '2025-12-15' },
    { id: 'pen-2', title: 'Documento Pendente', description: 'Falta assinatura no contrato de locação da Ana.', severity: 'warning', date: '2025-12-20' },
    { id: 'pen-3', title: 'Estoque Crítico', description: 'Pneus Aro 26 abaixo do mínimo.', severity: 'warning', date: '2025-12-23' },
];

export const MOCK_CLIENTS: Client[] = [
    {
        id: '1',
        name: 'Roberto Silva',
        phone: '11999998888',
        email: 'roberto@email.com',
        birthDate: '03-15',
        notes: 'Cliente prefere contato via WhatsApp. Meio exigente com prazos.',
        lastPurchaseDate: '2025-12-08', // 15 days ago (relative to 2025-12-23)
        daysSinceLastPurchase: 15,
        revisionStatus: 'due',
        isScheduled: false,
        purchases: [
            { id: 'p1', productName: 'E-Bike Sport 500W', date: '2025-12-08', value: 8500 },
        ],
        revisions: [],
    },
    {
        id: '2',
        name: 'Julia Mendes',
        phone: '11988887777',
        birthDate: '12-23', // Today
        lastPurchaseDate: '2025-11-20',
        daysSinceLastPurchase: 33,
        revisionStatus: 'scheduled',
        isScheduled: true,
        scheduledDate: '2025-12-24', // Tomorrow
        purchases: [
            { id: 'p2', productName: 'E-Bike City', date: '2025-11-20', value: 6200 },
        ],
        revisions: [],
    },
    {
        id: '3',
        name: "Carlos 'Cadão' Oliveira",
        phone: '11977776666',
        birthDate: '05-10',
        notes: 'Usa a bike para delivery. Precisa de manutenção frequente.',
        lastPurchaseDate: '2025-11-08', // 45 days ago
        daysSinceLastPurchase: 45,
        revisionStatus: 'overdue',
        isScheduled: false,
        purchases: [
            { id: 'p3', productName: 'E-Bike Cargo', date: '2025-11-08', value: 9000 },
            { id: 'p3-old', productName: 'Bateria Extra 48V', date: '2025-02-15', value: 2500 },
        ],
        revisions: [
            { id: 'r1', date: '2025-11-01', description: 'Troca de pastilhas', cost: 150 },
            { id: 'r0', date: '2025-06-10', description: 'Revisão Geral 1000km', cost: 350 },
            { id: 'r-1', date: '2025-01-20', description: 'Ajuste Freios', cost: 80 },
        ],
    },
    {
        id: '4',
        name: 'Amanda Costa',
        phone: '21999990000',
        birthDate: '12-23', // Today
        lastPurchaseDate: '2025-12-03', // 20 days ago
        daysSinceLastPurchase: 20,
        revisionStatus: 'due',
        purchases: [
            { id: 'p4', productName: 'E-Bike Foldable', date: '2025-12-03', value: 5500 },
        ],
        revisions: [],
    },
    {
        id: '5',
        name: 'Fernanda Lima',
        phone: '31988881111',
        birthDate: '01-20',
        lastPurchaseDate: '2025-11-08', // 45 days ago
        daysSinceLastPurchase: 45,
        revisionStatus: 'overdue',
        purchases: [
            { id: 'p5', productName: 'E-Bike Sport 1000W', date: '2025-11-08', value: 12000 }
        ],
        revisions: []
    },
    {
        id: '6',
        name: 'Lucas Pereira',
        phone: '41999992222',
        birthDate: '06-12',
        lastPurchaseDate: '2025-12-08', // 15 days ago
        daysSinceLastPurchase: 15,
        revisionStatus: 'due',
        purchases: [
            { id: 'p6', productName: 'E-Bike City', date: '2025-12-08', value: 6000 }
        ],
        revisions: []
    },
    {
        id: '7',
        name: 'Ricardo Gomes',
        phone: '41988883333',
        birthDate: '12-30', // This month, not today
        lastPurchaseDate: '2025-10-10',
        daysSinceLastPurchase: 74,
        revisionStatus: 'ok',
        purchases: [],
        revisions: []
    }
];
