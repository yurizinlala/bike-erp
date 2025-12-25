"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Clock, CheckCircle2, Wallet, MoreHorizontal, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/types";

const COLUMNS: { id: OrderStatus; label: string; color: string; icon: any }[] = [
    { id: 'new', label: 'Novos', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: Plus },
    { id: 'prep', label: 'Em Preparação', color: 'bg-orange-50 border-orange-200 text-orange-700', icon: Clock },
    { id: 'payment', label: 'Pgto. Pendente', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: Wallet },
    { id: 'done', label: 'Concluídos', color: 'bg-green-50 border-green-200 text-green-700', icon: CheckCircle2 },
];

export default function OrdersPage() {
    const { orders, updateOrderStatus, deleteOrder } = useStore();

    // Hydration fix
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const moveOrder = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        toast.success("Status atualizado!");
    };

    const handleDelete = (id: string) => {
        deleteOrder(id);
        toast.success("Pedido removido.");
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/"><Button variant="ghost" size="icon" className="-ml-2"><ArrowLeft className="w-6 h-6" /></Button></Link>
                    <h1 className="text-xl font-bold text-slate-800">Pedidos</h1>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-1" /> Novo</Button>
            </div>
            <div className="flex-1 overflow-x-auto p-4">
                <div className="flex gap-4 min-w-[1000px] h-full">
                    {COLUMNS.map(col => (
                        <div key={col.id} className="flex-1 flex flex-col h-full bg-slate-100/50 rounded-xl border border-slate-200">
                            <div className={cn("p-3 border-b flex items-center gap-2 font-semibold", col.color, "bg-white rounded-t-xl")}>
                                <col.icon className="w-4 h-4" />
                                <span>{col.label}</span>
                                <Badge variant="secondary" className="ml-auto bg-white/50">{orders.filter(o => o.status === col.id).length}</Badge>
                            </div>
                            <ScrollArea className="flex-1 p-2">
                                <div className="space-y-3">
                                    {orders.filter(o => o.status === col.id).map(order => (
                                        <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 group hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge variant="outline" className={cn("text-[10px] px-1.5 h-5", order.type === 'Venda' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>{order.type}</Badge>
                                                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => moveOrder(order.id, 'prep')}>Mover: Preparação</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => moveOrder(order.id, 'payment')}>Mover: Pagamento</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => moveOrder(order.id, 'done')} className="text-green-600">Concluir</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(order.id)}>Excluir</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <div className="mb-2"><p className="font-semibold text-slate-800 text-sm">{order.clientName}</p><p className="text-xs text-slate-500">#{order.id}</p></div>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                <span className="text-xs text-slate-400">{order.date.split('-').slice(1).reverse().join('/')}</span>
                                                <div className="flex items-center font-bold text-slate-700 text-sm"><DollarSign className="w-3 h-3" />{order.value.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
