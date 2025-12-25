"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, AlertTriangle, Search, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

export default function InventoryPage() {
    const { products, addProduct, deleteProduct } = useStore();

    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // New Product Form State
    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("Acessório");
    const [newPrice, setNewPrice] = useState(0);
    const [newQty, setNewQty] = useState(0);
    const [newMinStock, setNewMinStock] = useState(2);
    const [newLocation, setNewLocation] = useState("");

    // Hydration fix for Zustand persist
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const filteredProducts = products.filter(product => {
        if (activeTab === "bikes" && product.category !== "Bicicleta") return false;
        if (activeTab === "parts" && (product.category === "Bicicleta" || product.category === "Serviço")) return false;

        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchLower) || product.location?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
        if (showLowStockOnly) return product.quantity <= product.minStock;
        return true;
    });

    const handleSaveProduct = () => {
        if (!newName) {
            toast.error("Preencha o nome do item.");
            return;
        }
        addProduct({
            name: newName, category: newCategory, price: newPrice, quantity: newQty, minStock: newMinStock, location: newLocation
        });
        toast.success(`"${newName}" adicionado ao estoque!`);
        setIsDialogOpen(false);
        // Reset form
        setNewName(""); setNewPrice(0); setNewQty(0); setNewMinStock(2); setNewLocation("");
    };

    const handleDelete = (id: string, name: string) => {
        deleteProduct(id);
        toast.success(`"${name}" removido do estoque.`);
    };

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                    <Link href="/"><Button variant="ghost" size="icon" className="-ml-2"><ArrowLeft className="w-6 h-6 text-slate-700" /></Button></Link>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold text-slate-800">Estoque</h1>
                        <p className="text-xs text-slate-500">Gerencie bicicletas e peças</p>
                    </div>
                    <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(true)}><Plus className="w-5 h-5" /></Button>
                </div>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="Buscar item..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <Button variant={showLowStockOnly ? "destructive" : "outline"} size="icon" onClick={() => setShowLowStockOnly(!showLowStockOnly)} className={cn("shrink-0", showLowStockOnly && "bg-red-50 text-red-600 border-red-200 hover:bg-red-100")}><AlertTriangle className="w-4 h-4" /></Button>
                    </div>
                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1"><TabsTrigger value="all">Tudo</TabsTrigger><TabsTrigger value="bikes">Bikes</TabsTrigger><TabsTrigger value="parts">Peças</TabsTrigger></TabsList>
                    </Tabs>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 pb-24">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader><TableRow className="bg-slate-50 hover:bg-slate-50"><TableHead className="w-[40%]">Item</TableHead><TableHead className="text-center">Qtd.</TableHead><TableHead className="text-right">R$</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => {
                                const isLowStock = product.quantity <= product.minStock;
                                const isOutOfStock = product.quantity === 0;
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium"><span className="text-slate-800">{product.name}</span><span className="text-[10px] text-slate-400 uppercase tracking-wide block">{product.location}</span></TableCell>
                                        <TableCell className="text-center"><Badge variant="outline" className={cn("font-bold", isOutOfStock ? "bg-red-100 text-red-600" : isLowStock ? "bg-yellow-50 text-yellow-600" : "bg-slate-50")}>{product.quantity}</Badge></TableCell>
                                        <TableCell className="text-right font-medium text-slate-700">{product.price.toLocaleString('pt-BR')}</TableCell>
                                        <TableCell>
                                            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product.id, product.name)}><Trash2 className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {filteredProducts.length === 0 && <div className="p-8 text-center text-slate-400">Nenhum produto encontrado.</div>}
                </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90%] rounded-xl"><DialogHeader><DialogTitle>Novo Produto</DialogTitle><DialogDescription>Adicione um item ao estoque.</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2"><Label>Nome do Item</Label><Input placeholder="Ex: Bateria 48V" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2"><Label>Categoria</Label><Select value={newCategory} onValueChange={setNewCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bicicleta">Bicicleta</SelectItem><SelectItem value="Peça">Peça</SelectItem><SelectItem value="Acessório">Acessório</SelectItem></SelectContent></Select></div>
                            <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2"><Label>Qtd. Inicial</Label><Input type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label>Mín. Alerta</Label><Input type="number" value={newMinStock} onChange={(e) => setNewMinStock(Number(e.target.value))} /></div>
                        </div>
                        <div className="space-y-2"><Label>Localização</Label><Input placeholder="Ex: Prateleira B" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} /></div>
                    </div>
                    <DialogFooter><Button onClick={handleSaveProduct} className="w-full bg-blue-600">Salvar Produto</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
