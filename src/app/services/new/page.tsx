"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench, Check, User, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStore } from "@/lib/store";
import { Client } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewServicePage() {
    const { clients, addOrder } = useStore();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [openClientCombo, setOpenClientCombo] = useState(false);

    const [bikeModel, setBikeModel] = useState("");
    const [description, setDescription] = useState("");

    const handleOpenOS = () => {
        if (!selectedClient) {
            toast.error("Selecione um cliente!");
            return;
        }
        if (!description) {
            toast.error("Descreva o problema!");
            return;
        }

        addOrder({
            clientName: selectedClient.name,
            type: 'Serviço',
            status: 'prep',
            value: 0, // OS initially has no value
            date: new Date().toISOString().split('T')[0]
        });

        const osNumber = Math.floor(Math.random() * 10000);
        toast.success(`Ordem de Serviço #${osNumber} Aberta!`, {
            description: `Cliente notificado via WhatsApp.`,
            duration: 4000
        });

        // Simulate navigation back
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    };


    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-2">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="w-6 h-6 text-slate-700" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">Nova Ordem de Serviço</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Step 1: Client */}
                <section className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
                        <User className="w-4 h-4" /> Cliente
                    </h2>
                    <Popover open={openClientCombo} onOpenChange={setOpenClientCombo}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openClientCombo}
                                className="w-full justify-between h-14 text-base border-slate-200 bg-white"
                            >
                                {selectedClient ? selectedClient.name : "Selecionar Cliente..."}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Buscar cliente..." />
                                <CommandList>
                                    <CommandEmpty>Cliente não encontrado.</CommandEmpty>
                                    <CommandGroup>
                                        {clients.map((client) => (
                                            <CommandItem
                                                key={client.id}
                                                value={client.name}
                                                onSelect={() => {
                                                    setSelectedClient(client);
                                                    setOpenClientCombo(false);
                                                }}
                                                className="h-12"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedClient?.id === client.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {client.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </section>

                {/* Step 2: Bike Details */}
                <section className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
                        <Bike className="w-4 h-4" /> Equipamento
                    </h2>
                    <Input
                        placeholder="Modelo da Bike (ex: E-Bike Sport 500W)"
                        value={bikeModel}
                        onChange={(e) => setBikeModel(e.target.value)}
                        className="h-14 bg-white border-slate-200"
                    />
                </section>

                {/* Step 3: Description */}
                <section className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
                        <Wrench className="w-4 h-4" /> Descrição do Problema
                    </h2>
                    <Textarea
                        placeholder="Descreva o que precisa ser feito..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[150px] bg-white border-slate-200 resize-none text-base p-4"
                    />
                </section>

            </div>

            <div className="p-4 bg-white border-t border-slate-100 mt-auto shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)]">
                <Button
                    onClick={handleOpenOS}
                    className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                    <Check className="w-5 h-5 mr-2" /> Abrir OS
                </Button>
            </div>

        </div>
    );

    function ChevronDown(props: any) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        )
    }
}
