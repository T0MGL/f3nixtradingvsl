import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/metaPixel';

export const Gateway: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Simulate initial loading sequence
        const timer = setTimeout(() => {
            setLoading(false);
            setTimeout(() => setShowContent(true), 500);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleNavigation = (path: string, label: string) => {
        trackEvent('ViewContent', { content_name: `Gateway Selection: ${label}` });
        navigate(path);
    };

    return (
        <div className="fixed inset-0 bg-black text-white overflow-y-auto font-sans selection:bg-amber-500/30">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

            {/* Loading Screen */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 z-50 bg-black ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                <div className="flex flex-col items-center gap-4">
                    {/* Minimalist Logo/Loader */}
                    <div className="w-16 h-16 border-l border-t border-amber-500/50 rounded-full animate-spin duration-[3s]" />
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Iniciando Protocolo...</span>
                </div>
            </div>

            {/* Main Content Portal */}
            <div className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-center pt-10 pb-20 md:pt-0 md:pb-0 transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

                {/* Branding - Updated to match Footer Identity */}
                <div className="mb-6 md:mb-16 text-center">
                    <h1 className="text-3xl md:text-5xl font-black gold-gradient-text uppercase tracking-tight mb-3 px-4">
                        Fenix Trading Academy
                    </h1>
                    <div className="h-px w-24 mx-auto bg-amber-500/30 mb-4" />
                    <p className="text-zinc-400 font-medium text-[10px] md:text-sm tracking-[0.3em] uppercase">
                        Educación en Trading de Élite
                    </p>
                </div>

                {/* The Choice - Improved Clarity */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch justify-center w-full max-w-5xl px-6 pb-20 md:pb-0">

                    {/* Option 1: Edu (Academy) */}
                    <button
                        onClick={() => handleNavigation('/vsl', 'Academy')}
                        className="group relative flex flex-col items-center gap-4 md:gap-6 w-full md:w-80 p-6 md:p-8 rounded-2xl bg-zinc-900/20 hover:bg-zinc-900/80 transition-all duration-500 ease-out border border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-1"
                    >
                        <div className="text-zinc-400 group-hover:text-amber-400 transition-colors duration-500 scale-100 group-hover:scale-110">
                            <svg className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="text-center space-y-3">
                            <span className="block text-xl md:text-2xl font-light text-white uppercase tracking-widest leading-none group-hover:font-medium transition-all">
                                Aprender<br />Trading Manual
                            </span>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto group-hover:text-zinc-400 transition-colors">
                                Domina la habilidad. Cursos en vivo y mentoría 1 a 1.
                            </p>
                            <span className="inline-block mt-4 text-[10px] tracking-[0.2em] text-amber-500/80 border-b border-amber-500/30 pb-1 group-hover:text-amber-400 group-hover:border-amber-400 transition-colors">
                                VER ACADEMIA
                            </span>
                        </div>
                    </button>

                    {/* Separator */}
                    <div className="hidden md:flex flex-col items-center justify-center text-zinc-700 text-xs tracking-widest my-auto h-full opacity-30">
                        <div className="h-full w-px bg-gradient-to-b from-transparent via-zinc-500 to-transparent" />
                    </div>

                    {/* Option 2: Invest (Bot) */}
                    <button
                        onClick={() => handleNavigation('/ai', 'Trading Bot')}
                        className="group relative flex flex-col items-center gap-4 md:gap-6 w-full md:w-80 p-6 md:p-8 rounded-2xl bg-zinc-900/20 hover:bg-zinc-900/80 transition-all duration-500 ease-out border border-white/5 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:-translate-y-1"
                    >
                        {/* Cyan hue removed to match Gold/Amber Fenix aesthetic */}
                        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500 pointer-events-none rounded-2xl" />

                        <div className="text-zinc-400 group-hover:text-amber-400 transition-colors duration-500 scale-100 group-hover:scale-110">
                            {/* Replaced Zap with TrendingUp/Growth Chart for better semantics */}
                            <svg className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="text-center space-y-3 relative z-10">
                            <span className="block text-xl md:text-2xl font-light text-white uppercase tracking-widest leading-none group-hover:font-medium transition-all">
                                Automatizar<br />Mis Inversiones
                            </span>
                            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto group-hover:text-zinc-400 transition-colors">
                                Sistema algorítmico 100% automático. Libertad temporal.
                            </p>
                            <span className="inline-block mt-4 text-[10px] tracking-[0.2em] text-amber-500/80 border-b border-amber-500/30 pb-1 group-hover:text-amber-400 group-hover:border-amber-400 transition-colors">
                                PROTOCOLO FENIX
                            </span>
                        </div>
                    </button>

                </div>
            </div>

            {/* Footer minimal - UPDATED WITH BRIGHT IDEA CREDIT */}
            <div className="absolute bottom-6 left-0 w-full text-center space-y-1 pointer-events-none z-20 pb-4 md:pb-0">
                <p className="text-[10px] text-zinc-600 tracking-[0.3em] uppercase">Selecciona Tu Camino</p>
                <a
                    href="https://thebrightidea.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors pointer-events-auto opacity-70 hover:opacity-100"
                >
                    Desarrollado por Bright Idea
                </a>
            </div>
        </div >
    );
};
