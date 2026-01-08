import React, { useEffect, useRef, useState } from 'react';
import { Play, Users, TrendingUp, ShieldCheck, Quote } from 'lucide-react';
import Hls from 'hls.js';
import { TestimonialCarousel } from './TestimonialCarousel';

// --- MINIMALIST COMPONENTS ---

// Updated to match reference: Horizontal Layout (Icon Left, Text Right)
const StatCard = ({ icon: Icon, value, label }: { icon: any, value: string, label: string }) => (
    <div className="bg-[#0a0a0a] border border-white/5 p-5 md:p-6 rounded-xl flex items-center gap-4 hover:border-amber-500/20 hover:bg-white/5 transition-all duration-300 group w-full cursor-default">
        <div className="w-12 h-12 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/10 group-hover:scale-110 transition-transform duration-300">
            <Icon size={22} strokeWidth={2} />
        </div>
        <div className="flex flex-col items-start">
            <h3 className="text-xl md:text-2xl font-bold text-white leading-none mb-1">{value}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

const VideoModal = ({ src, isOpen, onClose }: { src: string, isOpen: boolean, onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isOpen && videoRef.current) {
            const video = videoRef.current;
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.play();
            }
        }
    }, [isOpen, src]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <video
                    ref={videoRef}
                    className="w-full h-full"
                    controls
                    playsInline
                    autoPlay
                />
            </div>
        </div>
    );
};

const MinimalVideo = ({ src, name, label, onEnlarge }: { src: string, name: string, label: string, onEnlarge: (src: string) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
        }
    }, [src]);

    return (
        <div className="flex flex-col gap-3">
            <div
                className="relative rounded-xl overflow-hidden bg-[#0A0A0A] aspect-video w-full group cursor-pointer border border-white/5 shadow-lg"
                onClick={() => onEnlarge(src)}
            >
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    muted
                    playsInline
                    loop
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                    <div className="w-12 h-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 group-hover:border-amber-500/50 group-hover:text-amber-500 transition-all duration-300">
                        <Play size={18} className="fill-current ml-1" />
                    </div>
                </div>
            </div>
            <div className="px-1">
                <h4 className="text-white font-medium text-sm">{name}</h4>
                <p className="text-gray-500 text-xs">{label}</p>
            </div>
        </div>
    );
};

const MinimalReview = ({ quote, author, location }: { quote: string, author: string, location: string }) => (
    <div className="bg-transparent p-6 border-l border-white/10 hover:border-amber-500/50 transition-colors duration-300">
        <Quote size={20} className="text-amber-500/50 mb-4" />
        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light italic">
            "{quote}"
        </p>
        <div>
            <span className="block text-white font-bold text-xs uppercase tracking-wider">{author}</span>
            <span className="text-gray-600 text-[10px] uppercase tracking-wider">{location}</span>
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const SocialProof: React.FC = () => {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    return (
        <section className="pt-8 pb-24 md:pt-12 bg-[#020202] relative border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4 relative z-10">

                {/* 1. STATS SECTION (Updated to Horizontal Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24 max-w-5xl mx-auto">
                    <StatCard
                        icon={Users}
                        value="+40"
                        label="Estudiantes Activos"
                    />
                    <StatCard
                        icon={TrendingUp}
                        value="Diario"
                        label="Sesiones en Vivo"
                    />
                    <StatCard
                        icon={ShieldCheck}
                        value="Probada"
                        label="Metodología 100%"
                    />
                </div>

                {/* NEW: Testimonial Carousel Section */}
                <div className="mb-24">
                    <TestimonialCarousel />
                </div>

                {/* 2. VIDEO SECTION (Clean Grid) */}
                <div className="mb-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Comunidad Fenix</h2>
                            <p className="text-gray-500 text-sm font-light max-w-md">
                                Trading real, resultados reales. Sin promesas vacías, solo ejecución y disciplina.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MinimalVideo
                            name="Jessica"
                            label="Estudiante Fénix"
                            src="https://content.apisystem.tech/hls/medias/9bdho5l9zKdBthtXqzaL/media/transcoded_videos/cts-c38ddecad4e7faf5_,360,480,720,p.mp4.urlset/master.m3u8"
                            onEnlarge={setActiveVideo}
                        />
                        <MinimalVideo
                            name="Thiago"
                            label="Trader Fondeado"
                            src="https://content.apisystem.tech/hls/medias/9bdho5l9zKdBthtXqzaL/media/transcoded_videos/cts-507a05526f4043bf_,360,480,720,p.mp4.urlset/master.m3u8"
                            onEnlarge={setActiveVideo}
                        />
                        <MinimalVideo
                            name="Rolando"
                            label="Fase 2 Superada"
                            src="https://content.apisystem.tech/hls/medias/9bdho5l9zKdBthtXqzaL/media/transcoded_videos/cts-658a3b9669e008ca_,360,480,720,p.mp4.urlset/master.m3u8"
                            onEnlarge={setActiveVideo}
                        />
                        <MinimalVideo
                            name="Jonathan"
                            label="Estudiante Fénix"
                            src="https://content.apisystem.tech/hls/medias/9bdho5l9zKdBthtXqzaL/media/transcoded_videos/cts-8b45decd1b09cd4e_,360,480,720,p.mp4.urlset/master.m3u8"
                            onEnlarge={setActiveVideo}
                        />
                    </div>
                </div>

                {/* Video Lightbox Modal */}
                <VideoModal
                    src={activeVideo || ''}
                    isOpen={!!activeVideo}
                    onClose={() => setActiveVideo(null)}
                />

                {/* 3. TEXT REVIEWS (Minimal Typography) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-white/5 pt-16">
                    <MinimalReview
                        quote="Profe!! Acabo de pasar la fase 1 de la prueba de fondeo de 10k. La clase de psicotrading de ayer fue clave para no sobreoperar."
                        author="Santi R."
                        location="Asunción"
                    />
                    <MinimalReview
                        quote="Yo pensaba que esto era para gente con mucha plata. Ahora entiendo que puedo empezar con poco y hacer crecer mi capital de forma inteligente."
                        author="Marcelo D."
                        location="Ciudad del Este"
                    />
                    <MinimalReview
                        quote="La transparencia de operar en vivo y mostrar pérdidas y ganancias reales me dio la seguridad que buscaba."
                        author="Juan Pablo"
                        location="Encarnación"
                    />
                </div>

            </div>
        </section>
    );
};