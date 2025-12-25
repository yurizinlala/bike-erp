"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  ShoppingCart,
  Wrench,
  ClipboardList,
  Bike,
  Bell,
  TrendingUp,
  DollarSign,
  Cake,
  AlertCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

export default function Home() {
  const { clients, orders, pendencies } = useStore();

  // Hydration fix
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  // Calculate Real Stats
  const today = new Date().toISOString().split('T')[0];
  const salesTodayCount = orders.filter(o => o.date === today && o.type === 'Venda').length;
  const financialToday = orders
    .filter(o => o.date === today)
    .reduce((acc, o) => acc + o.value, 0);

  const currentMonthDay = new Date().toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
  const birthdaysTotal = clients.filter(c => c.birthDate === currentMonthDay).length;
  const pendingTotal = pendencies.length;

  const menuItems = [
    { label: "Estoque", icon: Package, color: "text-blue-500", bg: "bg-blue-50", href: "/inventory" },
    { label: "Clientes", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", href: "/clients" },
    { label: "Pedidos", icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-50", href: "/orders" },
    { label: "Peças", icon: Wrench, color: "text-orange-500", bg: "bg-orange-50", href: "/inventory" },
    { label: "Pendências", icon: ClipboardList, color: "text-red-500", bg: "bg-red-50", href: "/pendencies" },
    { label: "Aluguel", icon: Bike, color: "text-teal-500", bg: "bg-teal-50", href: "/rentals" },
  ];

  const notifications = [
    { id: 1, title: "Novo Pedido", desc: "Roberto Silva comprou uma E-Bike.", time: "10 min ago", type: "sale" },
    { id: 2, title: "Aniversariante", desc: "Hoje é aniversário de Julia Mendes!", time: "2h ago", type: "bday" },
    { id: 3, title: "Estoque Baixo", desc: "Pneu Aro 26 atingiu o limite mínimo.", time: "5h ago", type: "alert" },
  ];

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50/50">

      {/* Header */}
      <div className="p-4 bg-white shadow-sm z-10 sticky top-0 border-b">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 italic">BIKE <span className="text-blue-600 not-italic">ERP</span></h1>
          <div className="flex items-center gap-1">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Wrench className="w-5 h-5 text-slate-600" />
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 flex flex-col w-[85%] sm:w-[400px]">
                <SheetHeader className="p-6 border-b bg-slate-50/50 text-left">
                  <SheetTitle className="text-2xl font-bold">Notificações</SheetTitle>
                  <SheetDescription>Fique por dentro das atividades da loja.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        n.type === 'sale' ? "bg-emerald-100 text-emerald-600" :
                          n.type === 'bday' ? "bg-pink-100 text-pink-600" : "bg-orange-100 text-orange-600"
                      )}>
                        {n.type === 'sale' ? <DollarSign className="w-5 h-5" /> :
                          n.type === 'bday' ? <Cake className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-slate-900">{n.title}</p>
                        <p className="text-sm text-slate-500 leading-tight">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative group">
            <TrendingUp className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardContent className="p-4">
              <p className="text-xs font-medium text-blue-100 uppercase mb-1">Vendas Hoje</p>
              <h3 className="text-2xl font-bold">{salesTodayCount}</h3>
              <p className="text-[10px] text-blue-200 mt-2 font-medium">+15% vs ontem</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-800 text-white overflow-hidden relative group">
            <DollarSign className="absolute -right-2 -bottom-2 w-16 h-16 opacity-10 group-hover:scale-110 transition-transform" />
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-400 uppercase mb-1">Financeiro</p>
              <h3 className="text-2xl font-bold italic">R$ {financialToday.toLocaleString('pt-BR')}</h3>
              <p className="text-[10px] text-emerald-400 mt-2 font-medium">Meta: 85% batida</p>
            </CardContent>
          </Card>

          <Link href="/birthdays" className="col-span-1">
            <Card className="border-none shadow-sm bg-white hover:bg-slate-50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Aniv. Hoje</p>
                  <h3 className="text-xl font-bold text-slate-800">{birthdaysTotal}</h3>
                </div>
                <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500">
                  <Cake className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pendencies" className="col-span-1">
            <Card className="border-none shadow-sm bg-white hover:bg-slate-50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase mb-1">Pendências</p>
                  <h3 className="text-xl font-bold text-slate-800">{pendingTotal}</h3>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 grid grid-cols-2 gap-3 mb-6">
          <Link href="/sales/new">
            <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-md">
              <ShoppingCart className="mr-2 h-6 w-6" /> VENDA
            </Button>
          </Link>
          <Link href="/services/new">
            <Button className="w-full h-16 bg-slate-800 hover:bg-slate-900 font-bold text-lg shadow-md">
              <Wrench className="mr-2 h-6 w-6" /> SERVIÇO
            </Button>
          </Link>
        </div>

        {/* Quick Menu */}
        <div className="px-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase mb-3 px-1">Menu Rápido</h2>
          <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item, idx) => (
              <Link href={item.href} key={idx}>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 hover:shadow-md transition-all active:scale-95 group">
                  <div className={cn("p-3 rounded-xl transition-colors", item.bg, "group-hover:bg-opacity-80")}>
                    <item.icon className={cn("w-6 h-6", item.color)} />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Nav Placeholder (optional if we want real app feel) */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t p-3 flex justify-around items-center h-16 z-50">
        <Link href="/" className="text-blue-600 flex flex-col items-center"><TrendingUp className="w-6 h-6" /><span className="text-[10px] font-bold">Home</span></Link>
        <Link href="/inventory" className="text-slate-400 flex flex-col items-center"><Package className="w-6 h-6" /><span className="text-[10px]">Estoque</span></Link>
        <Link href="/clients" className="text-slate-400 flex flex-col items-center"><Users className="w-6 h-6" /><span className="text-[10px]">Clientes</span></Link>
        <Link href="/orders" className="text-slate-400 flex flex-col items-center"><ShoppingCart className="w-6 h-6" /><span className="text-[10px]">Pedidos</span></Link>
        <Link href="/settings" className="text-slate-400 flex flex-col items-center"><Wrench className="w-6 h-6" /><span className="text-[10px]">Ajustes</span></Link>
      </div>

    </div>
  );
}
