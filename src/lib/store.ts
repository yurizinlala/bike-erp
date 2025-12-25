import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, Product, Order, OrderStatus, Pendency } from '@/types';

// Initial Data (moved from mock-data.ts to become mutable state)
const initialProducts: Product[] = [
    { id: 'p1', name: 'E-Bike Sport 500W', price: 8500, category: 'Bicicleta', quantity: 3, minStock: 2, location: 'Loja Principal' },
    { id: 'p2', name: 'E-Bike City', price: 6200, category: 'Bicicleta', quantity: 1, minStock: 2, location: 'Loja Principal' },
    { id: 'p3', name: 'E-Bike Cargo', price: 9000, category: 'Bicicleta', quantity: 0, minStock: 1, location: 'Depósito' },
    { id: 'p4', name: 'E-Bike Foldable', price: 5500, category: 'Bicicleta', quantity: 5, minStock: 2, location: 'Vitrine' },
    { id: 'a1', name: 'Bateria Extra 48V', price: 2500, category: 'Acessório', quantity: 4, minStock: 5, location: 'Prateleira A' },
    { id: 'a2', name: 'Capacete Pro', price: 250, category: 'Acessório', quantity: 15, minStock: 5, location: 'Prateleira B' },
    { id: 'a3', name: 'Cadeado U-Lock', price: 180, category: 'Acessório', quantity: 8, minStock: 3, location: 'Prateleira B' },
    { id: 'p_brake', name: 'Pastilha de Freio', price: 45, category: 'Peça', quantity: 22, minStock: 10, location: 'Gaveta 3' },
    { id: 'p_tire', name: 'Pneu Aro 26', price: 120, category: 'Peça', quantity: 2, minStock: 4, location: 'Estoque Fundos' },
];

const initialClients: Client[] = [
    { id: '1', name: 'Roberto Silva', phone: '11999998888', birthDate: '03-15', notes: 'Cliente VIP.', purchases: [], revisions: [], lastPurchaseDate: '2025-12-08', daysSinceLastPurchase: 15, revisionStatus: 'due' },
    { id: '2', name: 'Julia Mendes', phone: '11988887777', birthDate: '12-23', purchases: [], revisions: [], lastPurchaseDate: '2025-11-20', daysSinceLastPurchase: 33, revisionStatus: 'scheduled', isScheduled: true, scheduledDate: '2025-12-24' },
    { id: '3', name: "Carlos 'Cadão' Oliveira", phone: '11977776666', birthDate: '05-10', notes: 'Usa a bike para delivery.', purchases: [], revisions: [], lastPurchaseDate: '2025-11-08', daysSinceLastPurchase: 45, revisionStatus: 'overdue' },
    { id: '4', name: 'Amanda Costa', phone: '21999990000', birthDate: '12-23', purchases: [], revisions: [], lastPurchaseDate: '2025-12-03', daysSinceLastPurchase: 20, revisionStatus: 'due' },
];

const initialOrders: Order[] = [
    { id: 'ord-101', clientName: 'Roberto Silva', type: 'Venda', status: 'new', value: 8750, date: '2025-12-23' },
    { id: 'ord-102', clientName: 'Julia Mendes', type: 'Serviço', status: 'prep', value: 350, date: '2025-12-22' },
    { id: 'ord-103', clientName: 'Carlos Oliveira', type: 'Serviço', status: 'payment', value: 80, date: '2025-12-20' },
    { id: 'ord-104', clientName: 'Condomínio Solar', type: 'Venda', status: 'new', value: 18000, date: '2025-12-23' },
    { id: 'ord-105', clientName: 'Ana Clara', type: 'Serviço', status: 'done', value: 120, date: '2025-12-18' },
];

const initialPendencies: Pendency[] = [
    { id: '1', title: 'Pagamento em atraso', description: 'O cliente Roberto Silva está com um pagamento pendente há 5 dias.', severity: 'critical', date: '2025-12-18' },
    { id: '2', title: 'Estoque baixo: Pneu Aro 26', description: 'Restam apenas 2 unidades no estoque.', severity: 'warning', date: '2025-12-22' },
];

interface StoreState {
    products: Product[];
    clients: Client[];
    orders: Order[];
    pendencies: Pendency[];

    // Product Actions
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: string, data: Partial<Product>) => void;
    deleteProduct: (id: string) => void;

    // Client Actions
    addClient: (client: Omit<Client, 'id'>) => void;
    updateClient: (id: string, data: Partial<Client>) => void;
    deleteClient: (id: string) => void;

    // Order Actions
    addOrder: (order: Omit<Order, 'id'>) => void;
    updateOrderStatus: (id: string, status: OrderStatus) => void;
    deleteOrder: (id: string) => void;

    // Pendency Actions
    resolvePendency: (id: string) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set) => ({
            products: initialProducts,
            clients: initialClients,
            orders: initialOrders,
            pendencies: initialPendencies,

            // Product Actions
            addProduct: (product) => set((state) => ({
                products: [...state.products, { ...product, id: `p-${Date.now()}` }]
            })),
            updateProduct: (id, data) => set((state) => ({
                products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
            })),
            deleteProduct: (id) => set((state) => ({
                products: state.products.filter(p => p.id !== id)
            })),

            // Client Actions
            addClient: (client) => set((state) => ({
                clients: [...state.clients, { ...client, id: `c-${Date.now()}` }]
            })),
            updateClient: (id, data) => set((state) => ({
                clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
            })),
            deleteClient: (id) => set((state) => ({
                clients: state.clients.filter(c => c.id !== id)
            })),

            // Order Actions
            addOrder: (order) => set((state) => ({
                orders: [...state.orders, { ...order, id: `ord-${Date.now()}` }]
            })),
            updateOrderStatus: (id, status) => set((state) => ({
                orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
            })),
            deleteOrder: (id) => set((state) => ({
                orders: state.orders.filter(o => o.id !== id)
            })),

            // Pendency Actions
            resolvePendency: (id) => set((state) => ({
                pendencies: state.pendencies.filter(p => p.id !== id)
            })),
        }),

        {
            name: 'bike-erp-storage', // LocalStorage key
        }
    )
);
