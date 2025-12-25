"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ShoppingCart, Check, Calculator, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/lib/store";
import { Client, Product } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function NewSalePage() {
    const { clients, products, addOrder } = useStore();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [openClientCombo, setOpenClientCombo] = useState(false);
    const [openProductCombo, setOpenProductCombo] = useState(false);

    const [cart, setCart] = useState<Product[]>([]);

    const handleAddProduct = (product: Product) => {
        setCart([...cart, product]);
        setOpenProductCombo(false);
        toast.info(`${product.name} adicionado!`);
    };

    const removeProduct = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const total = cart.reduce((acc, p) => acc + p.price, 0);

    const handleFinalize = () => {
        if (!selectedClient) {
            toast.error("Selecione um cliente primeiro!");
            return;
        }
        if (cart.length === 0) {
            toast.error("Adicione produtos ao carrinho!");
            return;
        }

        addOrder({
            clientName: selectedClient.name,
            type: 'Venda',
            status: 'new',
            value: total,
            date: new Date().toISOString().split('T')[0]
        });

        toast.success("Venda Finalizada com Sucesso!", {
            description: `Total: R$ ${total.toLocaleString('pt-BR')} para ${selectedClient.name}`,
            duration: 4000
        });

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
                    <h1 className="text-xl font-bold text-slate-800">Nova Venda</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">

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

                {/* Step 2: Items */}
                <section className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-semibold text-slate-500 uppercase flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" /> Itens ({cart.length})
                        </h2>

                        <Popover open={openProductCombo} onOpenChange={setOpenProductCombo}>
                            <PopoverTrigger asChild>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-1" /> Add Produto
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="Buscar produto..." />
                                    <CommandList>
                                        <CommandEmpty>Produto não encontrado.</CommandEmpty>
                                        <CommandGroup>
                                            {products.map((product) => (
                                                <CommandItem
                                                    key={product.id}
                                                    value={product.name}
                                                    onSelect={() => handleAddProduct(product)}
                                                >
                                                    <div className="flex justify-between w-full">
                                                        <span>{product.name}</span>
                                                        <span className="font-bold">R$ {product.price}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        {cart.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="bg-white p-3 rounded-lg border border-slate-100 flex justify-between items-center shadow-sm">
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-slate-700">R$ {item.price.toLocaleString('pt-BR')}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeProduct(idx)} className="text-red-400 hover:text-red-500 hover:bg-red-50 h-8 w-8">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400">
                                Carrinho vazio. Adicione produtos.
                            </div>
                        )}
                    </div>
                </section>

            </div>

            {/* POS Total & Finish */}
            <div className="bg-white border-t border-slate-200 p-4 absolute bottom-0 w-full z-20 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-sm font-medium text-slate-500 uppercase">Total a Pagar</span>
                    <span className="text-3xl font-bold text-slate-800">R$ {total.toLocaleString('pt-BR')}</span>
                </div>
                <Button
                    onClick={handleFinalize}
                    className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                >
                    <Check className="w-5 h-5 mr-2" /> Finalizar Venda
                </Button>
            </div>

        </div>
    );
}
