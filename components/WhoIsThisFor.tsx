import React from 'react';
import { Check, X, AlertTriangle, BadgeCheck } from 'lucide-react';

export const WhoIsThisFor: React.FC = () => {
  return (
    <section className="py-24 bg-black relative">
       {/* Subtle Background Radial */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-zinc-900/20 blur-[100px] rounded-full pointer-events-none" />
       
       <div className="max-w-4xl mx-auto px-4 relative z-10">
            
            {/* Intro Headline */}
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Filtro de <span className="text-amber-500">Admisión</span>
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
                    No aceptamos a cualquiera. Nuestro sistema requiere disciplina. 
                    <span className="text-gray-200 font-medium"> Lee esto antes de tomar una decisión.</span>
                </p>
            </div>

            <div className="grid gap-12">
                
                {/* CARD: NO ENTRES SI... (RED) */}
                <div className="relative border border-red-900/30 bg-[#0a0000] rounded-3xl p-8 md:p-10 shadow-[0_0_40px_-10px_rgba(220,38,38,0.1)]">
                    {/* Header Pill */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#1a0505] border border-red-900/50 px-6 py-2 rounded-full flex items-center gap-2 shadow-lg z-20">
                        <AlertTriangle size={16} className="text-red-500 fill-red-500/10" />
                        <span className="text-red-500 text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                            NO ENTRES SI...
                        </span>
                    </div>

                    <ul className="space-y-6 mt-4">
                        {[
                            "Buscas hacerte rico de la noche a la mañana sin esfuerzo ni estudio.",
                            "Tienes \"mentalidad de casino\" y buscas apostar en lugar de invertir.",
                            "No eres capaz de seguir instrucciones simples y disciplinadas.",
                            "Culpas al mercado, al gobierno o a tu suerte por tus resultados financieros."
                        ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-red-950/50 border border-red-900/50 flex items-center justify-center mt-0.5 group-hover:border-red-500 transition-colors">
                                    <X size={12} className="text-red-500" strokeWidth={3} />
                                </div>
                                <p className="text-gray-300 text-base font-light group-hover:text-red-100 transition-colors">
                                    {text}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CARD: ESTO ES PARA TI SI... (GREEN) */}
                <div className="relative border border-emerald-900/30 bg-[#000a05] rounded-3xl p-8 md:p-10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]">
                     {/* Header Pill */}
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#021a0f] border border-emerald-900/50 px-6 py-2 rounded-full flex items-center gap-2 shadow-lg z-20">
                        <BadgeCheck size={16} className="text-emerald-500 fill-emerald-500/10" />
                        <span className="text-emerald-500 text-xs md:text-sm font-bold uppercase tracking-widest whitespace-nowrap">
                            ESTO ES PARA TI SI...
                        </span>
                    </div>

                    <ul className="space-y-6 mt-4">
                        {[
                            "Estás dispuesto a dedicar 1 hora al día para aprender una habilidad de por vida.",
                            "Entiendes que el trading es un negocio serio de gestión de riesgo.",
                            "Quieres capitalizarte con fondos de empresas (Prop Firms) sin arriesgar tu patrimonio.",
                            "Buscas un mentor transparente que opere en vivo contigo."
                        ].map((text, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center mt-0.5 group-hover:border-emerald-500 transition-colors">
                                    <Check size={12} className="text-emerald-500" strokeWidth={4} />
                                </div>
                                <p className="text-gray-200 text-base font-medium group-hover:text-white transition-colors">
                                    {text}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
       </div>
    </section>
  );
};