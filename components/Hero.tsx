import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Volume2 } from 'lucide-react';
import Hls from 'hls.js';

interface HeroProps {
  onCtaClick: () => void;
}

// Sub-componente mejorado para el efecto de máquina de escribir
const TypewriterText = ({ text, delay = 500 }: { text: string, delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  // Iniciar después del delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  // Lógica de tipeo recursiva para mayor fluidez (Smoothness)
  useEffect(() => {
    if (!started) return;

    if (displayText.length < text.length) {
      // Velocidad: 75ms es el punto dulce para lectura humana vs velocidad mecánica
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, 71);
      return () => clearTimeout(timeout);
    }
  }, [started, displayText, text]);

  return (
    <span className="inline-flex items-center">
      {displayText}
      {/* Cursor estilo terminal: Alto contraste, parpadeo nítido */}
      <span
        className="w-[3px] h-[0.9em] bg-amber-500 ml-1 inline-block"
        style={{
          animation: 'blink 1s step-end infinite',
          opacity: 1
        }}
      ></span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Tracks if user has fully engaged (unmuted)
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = "https://content.apisystem.tech/hls/medias/9bdho5l9zKdBthtXqzaL/media/transcoded_videos/cts-8d12cee655543b83_,360,480,720,1080,p.mp4.urlset/master.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Auto-play muted on load
        video.play().catch(e => console.log("Autoplay blocked", e));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.log("Autoplay blocked", e));
      });
    }
  }, []);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isMuted) {
        // First click: Unmute and restart for full impact
        videoRef.current.muted = false;
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setIsMuted(false);
        setIsPlaying(true);
      } else {
        // Toggle play/pause if already unmuted
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    }
  };

  return (
    <section className="relative pt-8 pb-4 px-4 md:pt-20 md:pb-8 overflow-hidden bg-black">
      {/* Background: Reduced opacity for deeper black */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>

      {/* Reduced blob intensity to keep background black */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-amber-900/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-breathe" />

      <div className="max-w-5xl mx-auto text-center relative z-10">

        {/* H1 Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 tracking-tight animate-slide-up-fade min-h-[3.3em] md:min-h-[2.2em]">
          <div className="mb-2">
            <TypewriterText text="Tu Ruta Hacia la Rentabilidad:" delay={300} />
          </div>
          <span className="text-gray-400">Copia el Sistema</span> <span className="text-gray-700 text-3xl align-middle mx-1">➝</span> <span className="text-gray-200">Domina la Ejecución</span> <span className="text-gray-700 text-3xl align-middle mx-1">➝</span> <span className="gold-gradient-text">Multiplica tu Capital</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
          Dejá de buscar "fórmulas mágicas". Aprendé a gestionar y multiplicar tu propio dinero operando <strong className="text-amber-500 font-medium">Forex, Metales e Índices</strong> con la misma precisión, lógica y frialdad que los traders institucionales.
        </p>

        {/* VSL Container - Clean & Premium */}
        <div className="relative max-w-4xl mx-auto mt-8">

          {/* Soft Ambient Glow - breathing animation */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-white/10 to-transparent rounded-2xl blur-sm opacity-50 animate-pulse"></div>
          <div className="absolute -inset-4 bg-amber-500/10 rounded-[30px] blur-2xl opacity-40 pointer-events-none animate-breathe"></div>

          {/* Main Video Frame */}
          <div
            className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl z-10 group"
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={true}
              playsInline
              loop={!isPlaying} // Loop when in background mode
              controls={!isMuted} // Show controls only when watching for real
              onClick={handlePlayClick}
            />

            {/* Overlay - Only visible if muted */}
            {isMuted && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/5 hover:bg-transparent transition-all duration-300 cursor-pointer"
                onClick={handlePlayClick}
              >
                <div className="flex items-center gap-2 text-amber-500 text-xs md:text-sm font-bold uppercase tracking-wider bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-amber-500/20 shadow-xl animate-pulse hover:scale-105 transition-transform">
                  <Volume2 size={16} />
                  Click para activar sonido
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Primary CTA Area - Reduced margin-top (mt-14 -> mt-8) for tightness */}
        <div className="mt-8 flex flex-col items-center w-full">

          {/* Button with Shimmer Effect and ID for Sticky Logic */}
          <button
            id="hero-cta"
            onClick={onCtaClick}
            className="gold-gradient-bg btn-shimmer text-black text-lg md:text-xl font-bold py-5 px-12 rounded shadow-[0_10px_30px_-10px_rgba(245,158,11,0.2)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.4)] hover:-translate-y-1 active:scale-95 active:shadow-none transition-all duration-200 w-full md:w-auto flex items-center justify-center gap-3 tracking-tight ease-out touch-manipulation"
          >
            <BarChart3 size={22} className="opacity-80" />
            INICIAR MI CARRERA COMO TRADER
          </button>

        </div>

      </div>
    </section>
  );
};