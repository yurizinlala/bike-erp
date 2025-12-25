"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Bike, Calendar, Clock, User, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_RENTALS = [
    { id: 'r1', clientName: 'João Silva', bike: 'E-Bike City #04', status: 'active', dueDate: '2025-12-28', price: 150 },
    { id: 'r2', clientName: 'Maria Santos', bike: 'E-Bike Sport #12', status: 'overdue', dueDate: '2025-12-20', price: 200 },
    { id: 'r3', clientName: 'Pedro Souza', bike: 'E-Bike Cargo #01', status: 'completed', dueDate: '2025-12-15', price: 180 },
];

export default function RentalsPage() {
    const [rentals] = useState(MOCK_RENTALS);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="w-6 h-6 text-slate-700" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">Aluguel</h1>
                </div>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" /> Novo Aluguel
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {rentals.map((rental) => (
                    <Card key={rental.id} className="border-slate-100 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        rental.status === 'overdue' ? "bg-red-50 text-red-500" :
                                            rental.status === 'active' ? "bg-blue-50 text-blue-500" :
                                                "bg-slate-50 text-slate-400"
                                    )}>
                                        <Bike className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{rental.bike}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <User className="w-3 h-3" />
                                            {rental.clientName}
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[10px] px-2 h-6 flex items-center gap-1",
                                    rental.status === 'active' ? "text-blue-600 border-blue-100 bg-blue-50" :
                                        rental.status === 'overdue' ? "text-red-600 border-red-100 bg-red-50" :
                                            "text-slate-500 border-slate-100 bg-slate-50"
                                )}>
                                    {rental.status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                                    {rental.status === 'active' ? 'Ativo' : rental.status === 'overdue' ? 'Atrasado' : 'Concluído'}
                                </Badge>
                            </div>
                            <div className="p-4 flex justify-between items-center bg-slate-50/30">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Vencimento</p>
                                    <div className="flex items-center gap-1 text-sm text-slate-700 font-medium">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {rental.dueDate}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Valor</p>
                                    <p className="font-bold text-slate-800 text-lg">R$ {rental.price}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
