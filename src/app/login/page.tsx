"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            toast.success("Login realizado com sucesso!");
            // Simulate redirect
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            toast.error("Preencha todos os campos.");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 justify-center px-6">
            <div className="w-full max-w-sm mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Bike className="w-8 h-8 text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Bike Elétrica ERP</h1>
                    <p className="text-slate-400">Faça login para gerenciar sua franquia.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <Input
                                type="email"
                                placeholder="seu@frotamail.com"
                                className="pl-10 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold">
                        Entrar
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="#" className="text-sm text-slate-500 hover:text-slate-300">
                        Esqueci minha senha
                    </Link>
                </div>
            </div>
        </div>
    );
}
