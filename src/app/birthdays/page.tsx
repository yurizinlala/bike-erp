"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Gift, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_CLIENTS } from "@/lib/mock-data";
import { toast } from "sonner";

export default function BirthdaysPage() {
    const [activeTab, setActiveTab] = useState("today");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // NOTE: hardcoded date to match mock assumption "Today is 12-23"
    const TODAY_MONTH = 12;
    const TODAY_DAY = 23;

    const filteredClients = MOCK_CLIENTS.filter(client => {
        const [monthStr, dayStr] = client.birthDate.split('-');
        const month = parseInt(monthStr);
        const day = parseInt(dayStr);

        if (activeTab === 'today') {
            return month === TODAY_MONTH && day === TODAY_DAY;
        } else {
            return month === TODAY_MONTH;
        }
    });

    const getAge = (birthDate: string) => {
        // Mock age calculation approx
        return 30 + Math.floor(Math.random() * 20);
    };

    const handleMassAction = () => {
        toast.success(`Promoção enviada para ${filteredClients.length} aniversariantes!`);
        setIsDialogOpen(false);
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
                    <h1 className="text-xl font-bold text-slate-800">Aniversariantes</h1>
                </div>

                <Tabs defaultValue="today" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1">
                        <TabsTrigger value="today">Do Dia</TabsTrigger>
                        <TabsTrigger value="month">Do Mês</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {filteredClients.map((client) => (
                    <div key={client.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border border-purple-100">
                                <AvatarFallback className="bg-purple-50 text-purple-600 font-bold">
                                    {client.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    <span>{client.birthDate.split('-').reverse().join('/')}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{getAge(client.birthDate)} anos</span>
                                </div>
                            </div>
                        </div>

                        <Button asChild size="icon" variant="ghost" className="text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 rounded-full h-10 w-10">
                            <a href={`https://wa.me/55${client.phone}?text=Feliz Aniversário!`} target="_blank" rel="noreferrer">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </Button>
                    </div>
                ))}

                {filteredClients.length === 0 && (
                    <div className="text-center py-10 flex flex-col items-center gap-2">
                        <div className="bg-slate-100 p-4 rounded-full">
                            <Gift className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">Nenhum aniversariante.</p>
                    </div>
                )}
            </div>

            {filteredClients.length > 0 && (
                <div className="absolute bottom-6 left-0 w-full px-4 z-20 animate-in slide-in-from-bottom-5">
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full h-14 text-lg font-bold shadow-xl shadow-purple-200 bg-purple-600 hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        Disparar Promoção
                    </Button>
                </div>
            )}

            {/* Trigger Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90%] rounded-xl">
                    <DialogHeader>
                        <DialogTitle>Mimo de Aniversário</DialogTitle>
                        <DialogDescription>
                            Envie uma mensagem especial para {filteredClients.length} clientes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2">
                        <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer active:border-purple-500 transition-colors bg-purple-50 border-purple-200">
                            <p className="font-semibold text-sm text-purple-900">🎁 Cupom de 10% OFF</p>
                            <p className="text-xs text-purple-700 truncate">"Parabéns! Ganhe 10% de desconto na sua revisão..."</p>
                        </div>
                        <div className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer active:border-purple-500 transition-colors">
                            <p className="font-semibold text-sm text-slate-800">🎈 Apenas Parabéns</p>
                            <p className="text-xs text-slate-500 truncate">"Desejamos muitas felicidades e muitos Km de alegria..."</p>
                        </div>
                    </div>

                    <DialogFooter className="flex-row gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={handleMassAction}>
                            <MessageCircle className="w-4 h-4 mr-2" /> Enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
