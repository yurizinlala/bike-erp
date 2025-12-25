"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PendenciesPage() {
    const { pendencies, resolvePendency } = useStore();

    // Hydration fix
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const handleResolve = (id: string, title: string) => {
        resolvePendency(id);
        toast.success(`Pendência "${title}" resolvida!`);
    };

    if (!isClient) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 border-b">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-slate-800">Pendências</h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {pendencies.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "bg-white p-4 rounded-xl border-l-4 shadow-sm space-y-3",
                            item.severity === 'critical' ? "border-l-red-500" : "border-l-orange-400"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                                {item.severity === 'critical' ? (
                                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                ) : (
                                    <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.date}</span>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs font-bold bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                onClick={() => handleResolve(item.id, item.title)}
                            >
                                <CheckCircle className="w-3 h-3 mr-1" /> RESOLVER
                            </Button>
                        </div>
                    </div>
                ))}

                {pendencies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <CheckCircle className="w-16 h-16 mb-4 text-emerald-500" />
                        <p className="text-xl font-bold">Tudo em dia!</p>
                        <p className="text-sm">Não há pendências críticas no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
