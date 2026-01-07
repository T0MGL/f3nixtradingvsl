import React from 'react';
import { MonitorPlay, BookOpen, BrainCircuit, Users, FileCheck } from 'lucide-react';

const StackItem = ({
    icon: Icon,
    title,
    description,
    value,
    isBonus = false
}: {
    icon: any,
    title: string,
    description: string,
    value: string,
    isBonus?: boolean
}) => (
    // Mobile Interaction: Added active:scale-[0.98] for tactile feedback
    <div className={`relative p-px rounded-2xl ${isBonus ? 'bg-gradient-to-br from-amber-400/50 via-yellow-600/50 to-amber-900/50' : 'bg-white/10'} mb-6 group transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] md:active:scale-100`}>
        <div className={`h-full bg-[#0a0a0a] rounded-2xl p-6 md:p-8 relative overflow-hidden group-hover:bg-white/5 transition-colors duration-300`}>
            {/* Background decoration - Visible slightly on mobile by default, stronger on hover for desktop */}
            <div className="absolute -right-6 -top-6 opacity-10 md:opacity-5 group-hover:opacity-15 transition-opacity duration-500">
                <Icon size={140} className={isBonus ? 'text-amber-500' : 'text-white'} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                {/* Visual Icon Box */}
                <div className={`w-16 h-16 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-300 ${isBonus ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 group-hover:bg-amber-500/20' : 'bg-zinc-800 border-white/10 text-gray-300 group-hover:border-amber-500/30 group-hover:text-amber-500'}`}>
                    <Icon size={32} />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                        <h3 className={`text-xl md:text-2xl font-bold ${isBonus ? 'text-white' : 'text-gray-100'} group-hover:text-amber-500 transition-colors`}>
                            {title}
                        </h3>
                        <span className="self-start md:self-auto bg-white/5 border border-white/10 px-3 py-1 rounded text-xs text-gray-400 font-mono group-hover:border-amber-500/30 transition-colors">
                            Valor: {value}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4 font-light">
                        {description}
                    </p>
                    {isBonus && (
                        <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest mt-2">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                            La Llave del Capital
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);



export const TheStack: React.FC = () => {
    return (
        <section className="py-24 bg-black" id="oferta">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">No Vendemos Humo.<br />Te Enseñamos a <span className="gold-gradient-text">Operar Como La Élite</span>.</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Este no es un curso de fin de semana. Es un programa de formación integral diseñado para llevarte de cero a gestionar capital institucional.</p>
                </div>



                <div className="space-y-6">
                    <StackItem
                        icon={MonitorPlay}
                        title="Trading Room: 1 AÑO DE CLASES ILIMITADAS"
                        value="$997 USD"
                        description="Esto es lo que nos diferencia. No te damos videos y te abandonamos. Tienes 12 MESES COMPLETOS de acceso a nuestras sesiones operativas en vivo. Conéctate a diario, pregunta, mira nuestras entradas y corrige tus errores en tiempo real."
                    />

                    <StackItem
                        icon={BookOpen}
                        title="Sistema 'Algoritmo Bancario' (Grabado)"
                        value="$497 USD"
                        description="El 95% del material en YouTube es basura minorista. Aprende a leer la Huella Institucional: Order Blocks, Ineficiencias y Liquidez. Entenderás por qué el precio se mueve y dónde entrar con precisión quirúrgica."
                    />

                    <StackItem
                        icon={BrainCircuit}
                        title="Protocolo de Psicotrading de Acero"
                        value="$297 USD"
                        description="El mercado no te vence, te vences tú mismo. Te entregamos nuestro sistema de gestión emocional para eliminar el miedo, la avaricia y el FOMO. Operarás con la frialdad de un algoritmo."
                    />

                    <StackItem
                        icon={Users}
                        title="Comunidad Elite & Mentoria Grupal"
                        value="$197 USD"
                        description="Acceso a nuestro Discord privado. Rodéate de otros traders paraguayos que están en tu mismo camino. Soporte 24/7 para revisar tus análisis y corregir errores antes de que te cuesten dinero."
                    />

                    {/* THE NEW HOOK - PROP FIRM BLUEPRINT */}
                    <div className="mt-12 scale-100 md:scale-105 transform border-t border-amber-500/30 pt-12 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black px-4 text-amber-500 text-sm font-bold uppercase tracking-widest">
                            El Acelerador de Resultados
                        </div>
                        <StackItem
                            icon={FileCheck}
                            title="BLUEPRINT: MULTIPLICA TU CAPITAL X10"
                            value="INVALUABLE"
                            isBonus={true}
                            description="La estrategia definitiva para escalar tu cuenta. Accede a nuestra hoja de ruta exacta para gestionar capitales de 10k, 50k o 100k+ de forma profesional. Te enseñamos cómo operar cuentas grandes con nuestro sistema institucional y quedarte con hasta el 80% de los beneficios. Solo trading real."
                        />
                    </div>
                </div>

                {/* Total Value Summary - OPTIMIZED FOR MOBILE */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500 text-xs md:text-sm uppercase tracking-widest mb-4 font-semibold">Valor Total del Ecosistema</p>
                    <div className="flex flex-col md:flex-row justify-center items-center md:items-baseline gap-3 md:gap-6">
                        <span className="text-4xl md:text-4xl text-gray-700 line-through decoration-gray-600 decoration-2 font-light decoration-from-font">$2,485</span>
                        <span className="text-6xl md:text-7xl font-black text-white leading-none">$327 USD</span>
                    </div>
                    <p className="text-amber-500 font-medium mt-6 text-sm md:text-base">Pago único. Acceso ilimitado por 1 Año.</p>
                </div>

            </div>
        </section>
    );
};