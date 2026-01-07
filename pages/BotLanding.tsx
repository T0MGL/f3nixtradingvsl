import React, { useState, useEffect } from 'react';
import { BotLeadFormModal } from '../components/BotLeadFormModal';
import { trackEvent } from '../utils/metaPixel';
import { Footer } from '../components/Footer';
import { BarChart3, ShieldAlert, TrendingUp, CheckCircle2 } from 'lucide-react';

// Reusing TypewriterText strictly for this page to ensure visual consistency
const TypewriterText = ({ text, delay = 500 }: { text: string, delay?: number }) => {
    const [displayText, setDisplayText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        if (displayText.length < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(text.slice(0, displayText.length + 1));
            }, 50); // Slightly faster for this context
            return () => clearTimeout(timeout);
        }
    }, [started, displayText, text]);

    return (
        <span className="inline-flex items-center">
            {displayText}
            <span className="w-[3px] h-[0.9em] bg-amber-500 ml-1 inline-block animate-pulse"></span>
        </span>
    );
};

export const BotLanding: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        trackEvent('ViewContent', { content_name: 'Fenix Auto Protocol Application' });
    };

    const closeModal = () => setIsModalOpen(false);

    const handleCtaClick = () => {
        trackEvent('InitiateCheckout', { content_name: 'Fenix Auto Access - $997' });
        openModal();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-amber-900/30 selection:text-amber-100 font-sans">

            {/* Navigation - Transparent & Premium */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-amber-500 rounded-sm"></div>
                    <div className="text-xl tracking-[0.1em] font-bold uppercase text-white">Fenix<span className="font-light text-amber-500">Auto</span></div>
                </div>
                <button
                    onClick={handleCtaClick}
                    className="hidden md:block text-xs uppercase tracking-widest border border-amber-500/20 text-amber-500/80 px-4 py-2 hover:bg-amber-500 hover:text-black transition-all duration-300 rounded"
                >
                    Solicitar Acceso
                </button>
            </nav>

            {/* Hero Section - Matching Hero.tsx aesthetic */}
            <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 pt-20 overflow-hidden">
                {/* Background Fx */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-breathe" />

                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-amber-500/20 animate-fade-in">
                        Nueva Tecnología de Ejecución
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                        <div className="mb-2 text-gray-400 font-light text-2xl md:text-4xl">
                            No busques más fórmulas.
                        </div>
                        <span className="block mt-4">
                            <TypewriterText text="Deja que el sistema trabaje." delay={800} />
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light pt-4">
                        El trading manual es brutalmente difícil. Las emociones te destruyen. <br className="hidden md:block" />
                        El <strong className="text-amber-500 font-medium">Protocolo Fenix Auto</strong> captura la volatilidad de Bitcoin 24/7. Sin estrés. Sin pantallas.
                    </p>

                    {/* CTA - Gold Gradient Button */}
                    <div className="pt-8 w-full flex justify-center">
                        <button
                            onClick={handleCtaClick}
                            className="gold-gradient-bg btn-shimmer text-black text-lg font-bold py-5 px-12 rounded shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-200 flex items-center gap-3 w-full md:w-auto justify-center"
                        >
                            <BarChart3 size={22} className="opacity-80" />
                            ACTIVAR PROTOCOLO
                        </button>
                    </div>

                    <p className="text-xs text-zinc-600 uppercase tracking-widest pt-4">Resultados auditados por terceros</p>
                </div>
            </section>

            {/* The Problem / Solution Canvas - Similar to ProblemSolution.tsx */}
            <section className="py-24 border-t border-white/5 bg-black relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Left: The Pain */}
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                ¿Por qué sigues <span className="text-red-500">perdiendo tiempo?</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <ShieldAlert className="text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Fatiga de Decisión</h4>
                                        <p className="text-zinc-400 text-sm">Analizar gráficos por horas agota tu voluntad. Entras mal porque estás cansado.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <TrendingUp className="text-red-500 shrink-0" />
                                    <div>
                                        <h4 className="text-white font-bold text-lg">Volatilidad Impredecible</h4>
                                        <p className="text-zinc-400 text-sm">Bitcoin se mueve mientras duermes. Te pierdes los mejores movimientos o te despiertas liquidado.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: The Solution Visual */}
                        <div className="relative p-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/10 to-black/50 overflow-hidden">
                            <h3 className="text-2xl font-bold text-white mb-6">La Solución Matemática</h3>
                            <p className="text-zinc-300 mb-8 leading-relaxed">
                                Nuestro algoritmo no "predice". Reacciona. Utiliza modelos de probabilidad institucional para capturar ineficiencias en el precio de Bitcoin.
                            </p>

                            <ul className="space-y-4">
                                {['Ejecución en milisegundos', 'Gestión de riesgo automática', '100% Pasivo para el usuario'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-amber-100/80">
                                        <CheckCircle2 size={16} className="text-amber-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <a
                                    href="https://www.myfxbook.com/members/GoldenForexx/capitalbtc-ai-trader/11726357"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 uppercase text-xs font-bold tracking-widest transition-colors"
                                >
                                    Ver Historial Auditado →
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Pricing / Offer Section - High Ticket Style */}
            <section className="py-32 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Tu Libertad Comienza Aquí</h2>
                        <p className="text-zinc-500">Acceso exclusivo al sistema que utilizo personalmente.</p>
                    </div>

                    <div className="bg-black border border-amber-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-amber-500/50 transition-all duration-500 shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Licencia Anual Fenix Auto</h3>
                                <div className="flex items-center gap-2 text-amber-500/80 text-sm">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    Cupos disponibles para este mes
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-light text-white">$997<span className="text-lg text-zinc-600">usd</span></div>
                                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Pago Único Anual</div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            {[
                                'Instalación "Manos Libres"',
                                'Conexión a tu propia cuenta (Tú controlas el capital)',
                                'Actualizaciones de algoritmo incluidas',
                                'Soporte Prioritario por WhatsApp',
                                'Guía de Gestión de Riesgo',
                                'Comunidad de Inversores'
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/5">
                                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                                    <span className="text-sm text-zinc-300">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleCtaClick}
                            className="gold-gradient-bg btn-shimmer w-full py-5 rounded text-black font-bold text-lg uppercase tracking-wider hover:opacity-90 transition-opacity"
                        >
                            SOLICITAR ACCESO AL SISTEMA
                        </button>

                        <p className="text-center text-xs text-zinc-600 mt-6 max-w-lg mx-auto">
                            *Los resultados pasados no garantizan resultados futuros. El trading de criptomonedas conlleva riesgo.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
            <BotLeadFormModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};
