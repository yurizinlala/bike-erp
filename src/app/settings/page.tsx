"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Store, Users, MessageSquare, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function SettingsPage() {

    const handleSave = () => {
        toast.success("Configurações salvas com sucesso!");
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b border-slate-100 flex items-center gap-3">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <ArrowLeft className="w-6 h-6 text-slate-700" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-slate-800">Ajustes</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 bg-white p-2 h-14 border-b border-slate-100 rounded-none sticky top-0 z-10">
                        <TabsTrigger value="profile" className="flex flex-col gap-1 items-center data-[state=active]:text-blue-600">
                            <Store className="w-4 h-4" />
                            <span className="text-[10px]">Loja</span>
                        </TabsTrigger>
                        <TabsTrigger value="team" className="flex flex-col gap-1 items-center data-[state=active]:text-blue-600">
                            <Users className="w-4 h-4" />
                            <span className="text-[10px]">Equipe</span>
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="flex flex-col gap-1 items-center data-[state=active]:text-blue-600">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-[10px]">Msgs</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="p-4 space-y-6 pb-24">
                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-4">
                            <div className="flex justify-center py-4">
                                <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-lg flex items-center justify-center">
                                    <Store className="w-10 h-10 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome da Franquia</Label>
                                    <Input defaultValue="Bike Elétrica Natal" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Endereço</Label>
                                    <Input defaultValue="Av. Engenheiro Roberto Freire, 1234" />
                                </div>
                                <div className="space-y-2">
                                    <Label>WhatsApp de Contato</Label>
                                    <Input defaultValue="+55 84 99999-8888" />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Team Tab */}
                        <TabsContent value="team" className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Membros da Equipe</h3>
                                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1" /> Convidar</Button>
                            </div>

                            <div className="bg-white rounded-lg border border-slate-100 divide-y">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback className="bg-blue-50 text-blue-600">U{i}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm text-slate-800">Usuário {i}</p>
                                                <p className="text-xs text-slate-500">{i === 1 ? 'Gerente' : 'Vendedor'}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-green-600 bg-green-50">Ativo</Badge>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Messages Tab */}
                        <TabsContent value="messages" className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700 border border-blue-100 mb-4">
                                Configure aqui os templates usados nas automações de revisão e aniversário. Use <strong>{'{{nome}}'}</strong> para o nome do cliente.
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Revisão 15 Dias</Label>
                                    <Textarea
                                        className="min-h-[80px]"
                                        defaultValue="Olá {{nome}}, sua bike completou 15 dias! Lembre-se de reapertar os parafusos."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Aniversário (Promoção)</Label>
                                    <Textarea
                                        className="min-h-[80px]"
                                        defaultValue="Parabéns {{nome}}! 🎂 Temos um presente para você: 10% OFF na revisão este mês!"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 absolute bottom-0 w-full z-20">
                <Button
                    onClick={handleSave}
                    className="w-full h-12 font-bold bg-slate-800 hover:bg-slate-900"
                >
                    <Save className="w-4 h-4 mr-2" /> Salvar Alterações
                </Button>
            </div>

        </div>
    );
}
