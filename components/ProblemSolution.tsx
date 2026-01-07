import React from 'react';
import { AlertTriangle, TrendingDown, ShieldAlert, XCircle, Ban, BrainCircuit } from 'lucide-react';

export const ProblemSolution: React.FC = () => {
    return (
        <section className="py-24 bg-[#050505] relative border-t border-white/5 overflow-hidden">
            {/* Background Decor - Golden Haze */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-amber-900/10 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">

                {/* HEADER SECTION */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 border border-red-500/20">
                        <AlertTriangle size={12} />
                        Realidad de Mercado
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                        El Problema <span className="text-amber-500">Real</span>
                    </h2>

                    <h3 className="text-xl md:text-2xl text-white font-medium mb-6">
                        ¿Por Qué el 95% de los Traders Pierde Dinero?
                    </h3>

                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                        No es porque el trading sea imposible. Es porque nadie les enseñó el camino correcto.
                        Si te identificas con alguno de estos puntos, <strong className="text-white">no estás solo.</strong>
                    </p>
                </div>

                {/* CONTENT GRID */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">

                    {/* Left Column: The Chart Visual (Evidence) */}
                    <div className="relative group">
                        {/* Glow effect behind the chart */}
                        <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-duration-500 animate-breathe"></div>

                        {/* Chart Container - Pure Black */}
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">

                            {/* 
                   IMAGEN ACTUALIZADA: Gráfico de velas japonesas naranjas sobre fondo negro puro.
                */}
                            <img
                                src="/assets/trading-chart.jpg"
                                alt="Institutional Trading Chart"
                                className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-700 ease-out opacity-90"
                            />

                            {/* Floating "Failure" Indicators overlaying the chart - ANIMATED FOR MOBILE */}
                            <div className="absolute top-[20%] right-[20%] z-20 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded backdrop-blur-md shadow-lg border border-red-500/50 flex items-center gap-2 animate-float">
                                <XCircle size={12} /> STOP LOSS HUNTED
                            </div>
                            <div className="absolute bottom-[30%] left-[15%] z-20 bg-zinc-800/90 text-gray-300 text-xs font-bold px-3 py-1 rounded backdrop-blur-md shadow-lg border border-white/10 flex items-center gap-2 animate-float-delayed">
                                <Ban size={12} className="text-amber-500" /> LIQUIDITY TRAP
                            </div>
                        </div>
                    </div>

                    {/* Right Column: The Pain Points List */}
                    <div className="space-y-6">

                        {/* Item 1 */}
                        <div className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 group active:scale-[0.99] active:bg-white/10 transition-all duration-200">
                            <div className="bg-zinc-900 h-12 w-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-colors">
                                <TrendingDown className="text-gray-500 group-hover:text-amber-500 transition-colors" size={20} />
                            </div>
                            <div>
                                <h4 className="text-white text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">La Trampa de la Liquidez</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Operas patrones de libro (Doble Techo, Soportes) que los bancos usan específicamente para cazar tu Stop Loss antes de mover el mercado real. Eres la contrapartida de los profesionales.
                                </p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 group active:scale-[0.99] active:bg-white/10 transition-all duration-200">
                            <div className="bg-zinc-900 h-12 w-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-colors">
                                <BrainCircuit className="text-gray-500 group-hover:text-amber-500 transition-colors" size={20} />
                            </div>
                            <div>
                                <h4 className="text-white text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">Parálisis Emocional</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Llenas el gráfico de indicadores pero te congelas al entrar. O peor, entras tarde por FOMO y sales temprano por miedo. Tu mente no está programada para la incertidumbre.
                                </p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="flex gap-5 p-6 rounded-2xl bg-white/5 border border-white/5 group active:scale-[0.99] active:bg-white/10 transition-all duration-200">
                            <div className="bg-zinc-900 h-12 w-12 rounded-full flex items-center justify-center shrink-0 border border-white/10 group-hover:border-amber-500/50 group-hover:bg-amber-500/10 transition-colors">
                                <ShieldAlert className="text-gray-500 group-hover:text-amber-500 transition-colors" size={20} />
                            </div>
                            <div>
                                <h4 className="text-white text-lg font-bold mb-2 group-hover:text-amber-500 transition-colors">Educación Obsoleta</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Te vendieron la idea de "ganar dinero rápido" sin enseñarte Gestión de Riesgo Institucional. Sin un plan matemático, estás apostando, no invirtiendo.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* The Transition/Solution Header */}
                <div className="text-center max-w-4xl mx-auto pt-10 border-t border-white/5 relative">
                    <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#050505] px-4 text-gray-500 text-xs tracking-widest uppercase">
                        Existe otra manera
                    </div>

                    <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider mb-8 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-pulse">
                        La Nueva Era del Trading
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6">El Ecosistema <span className="gold-gradient-text">Fenix Pro™</span></h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        Ingeniería inversa de lo que hacen los bancos, simplificado para que dejes de ser liquidez y empieces a ser rentable en tiempo récord.
                    </p>
                </div>

            </div>
        </section>
    );
};