"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { Client } from "@/types";

type RevisionFilter = '15d' | '20d' | '45d' | 'scheduled';

export default function RevisionsPage() {
    const [activeTab, setActiveTab] = useState<RevisionFilter>('15d');
    const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filter Logic
    const filteredClients = MOCK_CLIENTS.filter(client => {
        if (activeTab === 'scheduled') return client.revisionStatus === 'scheduled';

        // Simulate smart buckets based on day counts
        // In a real app this would be more precise.
        if (activeTab === '15d') return client.daysSinceLastPurchase && client.daysSinceLastPurchase >= 15 && client.daysSinceLastPurchase < 20 && client.revisionStatus !== 'scheduled';
        if (activeTab === '20d') return client.daysSinceLastPurchase && client.daysSinceLastPurchase >= 20 && client.daysSinceLastPurchase < 45 && client.revisionStatus !== 'scheduled';
        if (activeTab === '45d') return client.daysSinceLastPurchase && client.daysSinceLastPurchase >= 45 && client.revisionStatus !== 'scheduled';

        return false;
    });

    const toggleClient = (id: string) => {
        const newSelected = new Set(selectedClientIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedClientIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedClientIds.size === filteredClients.length) {
            setSelectedClientIds(new Set());
        } else {
            setSelectedClientIds(new Set(filteredClients.map(c => c.id)));
        }
    };

    const handleDisparar = () => {
        console.log(`Sending messages to ${selectedClientIds.size} clients...`);
        setIsDialogOpen(false);
        setSelectedClientIds(new Set()); // Reset
        // In real app show toast
        alert(`Enviando mensagem para ${selectedClientIds.size} clientes!`);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="w-6 h-6 text-slate-700" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">Controle de Revisões</h1>
                </div>

                <Tabs defaultValue="15d" onValueChange={(v) => { setActiveTab(v as RevisionFilter); setSelectedClientIds(new Set()); }}>
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1">
                        <TabsTrigger value="15d" className="text-xs">15 D</TabsTrigger>
                        <TabsTrigger value="20d" className="text-xs">20 D</TabsTrigger>
                        <TabsTrigger value="45d" className="text-xs">45 D</TabsTrigger>
                        <TabsTrigger value="scheduled" className="text-xs">Agenda</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {filteredClients.length > 0 && activeTab !== 'scheduled' && (
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <Checkbox
                            checked={selectedClientIds.size === filteredClients.length && filteredClients.length > 0}
                            onCheckedChange={toggleAll}
                            id="select-all"
                        />
                        <label htmlFor="select-all" className="text-sm font-medium text-slate-600">Selecionar Todos</label>
                    </div>
                )}

                {filteredClients.map((client) => (
                    <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {activeTab !== 'scheduled' ? (
                                <Checkbox
                                    checked={selectedClientIds.has(client.id)}
                                    onCheckedChange={() => toggleClient(client.id)}
                                    className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                            ) : (
                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>{client.purchases[0]?.productName || 'Produto N/A'}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className={`${activeTab === '45d' ? 'text-red-500 font-bold' :
                                            activeTab === '20d' ? 'text-orange-500 font-medium' : 'text-blue-500'
                                        }`}>
                                        Há {client.daysSinceLastPurchase} dias
                                    </span>
                                </div>
                                {client.isScheduled && (
                                    <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                                        Agendado: {client.scheduledDate?.split('-').reverse().join('/')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredClients.length === 0 && (
                    <div className="text-center py-10 flex flex-col items-center gap-2">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">Tudo certo por aqui!</p>
                        <p className="text-sm text-slate-400">Nenhum cliente neste período.</p>
                    </div>
                )}
            </div>

            {/* Floating Action Button for Triggering Data */}
            {selectedClientIds.size > 0 && (
                <div className="absolute bottom-6 left-0 w-full px-4 z-20 animate-in slide-in-from-bottom-5">
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full h-14 text-lg font-bold shadow-xl shadow-blue-200 bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Disparar ({selectedClientIds.size})
                    </Button>
                </div>
            )}

            {/* Trigger Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90%] rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Disparar Mensagens</DialogTitle>
                        <DialogDescription>
                            Escolha o template de mensagem para enviar aos {selectedClientIds.size} clientes selecionados.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer active:border-blue-500 transition-colors">
                            <p className="font-semibold text-sm text-slate-800">Template 1: Lembrete Padrão</p>
                            <p className="text-xs text-slate-500 truncate">"Olá! Sua e-bike está completando X dias..."</p>
                        </div>
                        <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer active:border-blue-500 transition-colors">
                            <p className="font-semibold text-sm text-slate-800">Template 2: Promoção 1ª Revisão</p>
                            <p className="text-xs text-slate-500 truncate">"Traga sua bike e ganhe 10% off na revisão..."</p>
                        </div>
                    </div>

                    <DialogFooter className="flex-row gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleDisparar}>
                            <Send className="w-4 h-4 mr-2" /> Enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
