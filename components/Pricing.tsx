import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Lock, Clock, CreditCard, ShieldCheck, Headset } from 'lucide-react';

interface PricingProps {
    onCtaClick: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ onCtaClick }) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

    // Simple countdown logic for urgency
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (num: number) => num.toString().padStart(2, '0');

    // Reusable Time Block Component
    const TimeBlock = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 md:p-4 min-w-[70px] md:min-w-[90px] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] group overflow-hidden">
                {/* Top Shine Effect */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Gold Glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>

                <span className="text-3xl md:text-5xl font-mono font-bold gold-gradient-text tracking-wider">
                    {formatTime(value)}
                </span>
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">
                {label}
            </span>
        </div>
    );

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black z-0"></div>

            <div className="max-w-3xl mx-auto px-4 relative z-10">

                {/* Timer Container */}
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest mb-4 bg-red-500/5 px-3 py-1 rounded-full border border-red-500/10 animate-pulse">
                        <Clock size={12} />
                        La oferta termina en
                    </div>

                    <div className="flex items-start gap-2 md:gap-4">
                        <TimeBlock value={timeLeft.hours} label="Horas" />

                        {/* Separator */}
                        <div className="pt-2 md:pt-4">
                            <div className="flex flex-col gap-2 opacity-50">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <TimeBlock value={timeLeft.minutes} label="Min" />

                        {/* Separator */}
                        <div className="pt-2 md:pt-4">
                            <div className="flex flex-col gap-2 opacity-50">
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>

                        <TimeBlock value={timeLeft.seconds} label="Seg" />
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="glass-panel border-2 border-amber-500 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-float">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black font-black px-6 py-2 rounded-full uppercase tracking-wider text-sm shadow-lg whitespace-nowrap">
                        85% OFF - OFERTA FLASH
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-2xl text-gray-300 mb-2">Sistema Fenix Completo + Bonos</h3>
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-4xl text-gray-600 line-through">$1,500</span>
                            <span className="text-6xl md:text-8xl font-black text-white tracking-tighter">$227</span>
                        </div>
                        <p className="text-green-500 font-medium mt-2">Pago Único. 12 Meses de Mentoría.</p>
                    </div>

                    <button
                        onClick={onCtaClick}
                        className="w-full gold-gradient-bg btn-shimmer text-black text-xl font-bold py-6 rounded-xl shadow-xl flex items-center justify-center gap-3 uppercase mb-6 group hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out"
                    >
                        <Lock size={20} />
                        DESBLOQUEAR ACCESO
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="space-y-3 max-w-md mx-auto">
                        <div className="flex items-center gap-3 text-white font-medium bg-white/5 p-2 rounded-lg border border-amber-500/30">
                            <div className="bg-amber-500 text-black p-1 rounded-full"><Check size={14} strokeWidth={3} /></div>
                            <span className="text-sm">CLASES EN VIVO ILIMITADAS (1 AÑO)</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 px-2">
                            <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-500" /></div>
                            <span className="text-sm">Curso completo "De Cero a Institucional"</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 px-2">
                            <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-500" /></div>
                            <span className="text-sm">Blueprint: Cómo pasar pruebas de fondeo</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 px-2">
                            <div className="bg-green-500/20 p-1 rounded-full"><Check size={14} className="text-green-500" /></div>
                            <span className="text-sm">Metodología 100% Validada</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-all duration-300 cursor-default select-none">
                        <Headset size={24} className="text-gray-300" strokeWidth={1.5} />
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest border-l border-white/10 pl-3">
                            No necesitas tarjeta • Un asesor te asistirá
                        </span>
                        <ShieldCheck size={24} className="text-gray-300" strokeWidth={1.5} />
                    </div>
                </div>
            </div>
        </section>
    );
};