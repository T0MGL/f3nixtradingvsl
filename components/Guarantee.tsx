import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';

export const Guarantee: React.FC = () => {
    return (
        <section className="py-16 bg-black relative">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-black border border-amber-500/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_60px_-15px_rgba(245,158,11,0.1)]">

                    {/* Background Seal Watermark */}
                    <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
                        <Award size={300} />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* Badge Visual */}
                        <div className="shrink-0 relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-amber-300 to-amber-600 rounded-full flex items-center justify-center shadow-2xl p-1 animate-float">
                                <div className="w-full h-full bg-black rounded-full border-2 border-amber-400/50 flex flex-col items-center justify-center text-amber-500">
                                    <Award size={48} className="mb-1" />
                                    <span className="text-2xl font-black text-white leading-none">700+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200">Validado</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center md:text-left flex-1">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                                Método Probado y Validado
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6 font-light">
                                Nuestro sistema no es teoría: es un método probado que ha generado <strong className="text-white">resultados reales y comprobados</strong> en más de <strong className="text-amber-500">700 estudiantes</strong> que ya están operando con éxito en los mercados.
                            </p>
                            <p className="text-gray-300 leading-relaxed font-light">
                                <strong className="text-white">Garantizamos que recibirás las mismas estrategias exactas</strong> que nuestros estudiantes más exitosos están utilizando hoy. Acceso completo a todas las herramientas, sesiones en vivo, y la comunidad exclusiva de traders. <br />
                                <span className="text-amber-500 font-medium italic">Método validado. Resultados comprobados. Estrategias reales.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};