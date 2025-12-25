"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, ChevronRight, Edit, Trash2, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Client } from "@/types";

export default function ClientsPage() {
    const { clients, addClient, deleteClient, updateClient } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Add Client Form State
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newBirthDate, setNewBirthDate] = useState("");

    // Hydration fix
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm));

    const handleAddClient = () => {
        if (!newName || !newPhone) { toast.error("Preencha nome e telefone."); return; }
        addClient({ name: newName, phone: newPhone, birthDate: newBirthDate || "01-01", purchases: [], revisions: [] });
        toast.success(`Cliente "${newName}" adicionado!`);
        setIsAddDialogOpen(false);
        setNewName(""); setNewPhone(""); setNewBirthDate("");
    };

    const handleDeleteClient = (id: string, name: string) => {
        deleteClient(id);
        toast.success(`Cliente "${name}" removido.`);
        setSelectedClient(null);
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b">
                <div className="flex items-center gap-3 mb-3">
                    <Link href="/"><Button variant="ghost" size="icon" className="-ml-2"><ArrowLeft className="w-6 h-6" /></Button></Link>
                    <h1 className="text-xl font-bold text-slate-800 flex-1">Clientes</h1>
                    <Button size="icon" className="rounded-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsAddDialogOpen(true)}><Plus className="w-5 h-5" /></Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar cliente..." className="pl-9 bg-slate-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredClients.map(client => (
                    <Sheet key={client.id}>
                        <SheetTrigger asChild>
                            <div onClick={() => setSelectedClient(client)} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10"><AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                                    <div><p className="font-medium text-slate-800">{client.name}</p><p className="text-xs text-slate-500">{client.phone}</p></div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-0 w-[90%] sm:w-[400px] flex flex-col">
                            <SheetHeader className="p-4 border-b"><SheetTitle className="text-left">{client.name}</SheetTitle></SheetHeader>
                            <Tabs defaultValue="profile" className="flex-1 flex flex-col">
                                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 mx-4 mt-2 rounded-lg sticky top-0 z-10"><TabsTrigger value="profile">Perfil</TabsTrigger><TabsTrigger value="history">Histórico</TabsTrigger><TabsTrigger value="notes">Notas</TabsTrigger></TabsList>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <TabsContent value="profile" className="space-y-4 m-0">
                                        <div className="text-center py-4"><Avatar className="h-20 w-20 mx-auto mb-2"><AvatarFallback className="text-2xl bg-emerald-50 text-emerald-600">{client.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar><h2 className="font-bold text-lg">{client.name}</h2><p className="text-sm text-slate-500">{client.phone}</p></div>
                                        <div className="flex justify-center gap-2">
                                            <Button asChild variant="outline" className="bg-green-50 text-green-600 border-green-200"><a href={`https://wa.me/55${client.phone}`} target="_blank"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp</a></Button>
                                            <Button variant="outline"><Edit className="w-4 h-4 mr-2" /> Editar</Button>
                                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteClient(client.id, client.name)}><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="history" className="m-0"><p className="text-center text-slate-400 py-8">Nenhum histórico ainda.</p></TabsContent>
                                    <TabsContent value="notes" className="m-0"><p className="text-slate-600 bg-slate-100 p-3 rounded-lg">{client.notes || "Sem anotações."}</p></TabsContent>
                                </div>
                            </Tabs>
                        </SheetContent>
                    </Sheet>
                ))}
                {filteredClients.length === 0 && <p className="text-center text-slate-400 py-8">Nenhum cliente encontrado.</p>}
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="w-[90%] rounded-xl"><DialogHeader><DialogTitle>Novo Cliente</DialogTitle><DialogDescription>Adicione um novo cliente à sua base.</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2"><Label>Nome Completo</Label><Input value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Telefone</Label><Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Data de Nasc. (MM-DD)</Label><Input placeholder="Ex: 03-15" value={newBirthDate} onChange={(e) => setNewBirthDate(e.target.value)} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleAddClient} className="w-full bg-emerald-600">Salvar Cliente</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
