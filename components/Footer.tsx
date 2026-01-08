import React from 'react';
import { Instagram, Send, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackEvent } from '../utils/metaPixel';

// Custom TikTok Icon (approximated with a music note style to match Lucide stroke style)
const TikTokIcon = ({ size = 24, className }: { size?: number | string, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SocialIcon = ({ icon: Icon, href, name }: { icon: any, href: string, name: string }) => {
  const handleClick = () => {
    trackEvent('Contact', { content_name: name });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 group"
    >
      <Icon size={20} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
    </a>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020202] pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">

        {/* Brand Identity */}
        <div className="mb-8">
          <img
            src="/assets/logofenix.jpeg"
            alt="Fenix Logo"
            className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 rounded-full border border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]"
          />
          <h2 className="text-2xl md:text-3xl font-black text-amber-500 uppercase tracking-tight mb-2">
            Fenix Trading Academy
          </h2>
          <p className="text-gray-400 font-medium text-sm md:text-base tracking-wide">
            Educación en Trading de Élite
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6 mb-8">
          <SocialIcon icon={Instagram} href="https://www.instagram.com/fxramiror/" name="Instagram" />
          <SocialIcon icon={TikTokIcon} href="https://www.tiktok.com/@fxramiror" name="TikTok" />
          <SocialIcon icon={Send} href="#" name="Telegram" />
        </div>

        {/* Legal Links (Required for Ads) */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-[10px] md:text-xs text-gray-600 font-medium uppercase tracking-wide opacity-60 hover:opacity-100 transition-opacity">
          <Link to="/privacidad" className="hover:text-amber-500 transition-colors">
            Política de Privacidad
          </Link>
          <span className="text-gray-800">•</span>
          <Link to="/terminos" className="hover:text-amber-500 transition-colors">
            Términos y Condiciones
          </Link>
        </div>

        {/* --- TEST ADMIN ACCESS BUTTON --- */}
        <div className="mb-10 opacity-50 hover:opacity-100 transition-opacity">
          <Link to="/crm" className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 px-4 py-2 rounded-full text-[10px] font-bold text-gray-500 hover:text-amber-500 transition-all">
            <Lock size={12} />
            STAFF ACCESS
          </Link>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="w-full max-w-2xl border-t border-white/5 pt-8 text-gray-500 text-xs leading-relaxed space-y-4">
          <p>
            © {new Date().getFullYear()} Fenix Trading Academy
          </p>

          <p className="text-gray-600 text-[10px] opacity-60">
            Descargo de responsabilidad: Los resultados presentados no son típicos y pueden variar. El trading conlleva riesgos significativos. Fenix Trading Academy ofrece educación y herramientas de análisis, no asesoramiento financiero personalizado.
          </p>

          <a
            href="https://thebrightidea.ai"
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors pt-4 opacity-40 hover:opacity-100"
          >
            Desarrollado por Bright Idea
          </a>
        </div>

      </div>
    </footer>
  );
};