import React from 'react';
import { Flame, DollarSign, Clock, UserPlus, TrendingUp, AlertCircle } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const items = [
    { 
      icon: Flame, 
      text: "URGENTE:", 
      highlight: "Solo quedan 4 lugares para la mentoría de esta semana",
      color: "text-red-500",
      live: true 
    },
    { 
      icon: DollarSign, 
      text: "RESULTADO RECIENTE:", 
      highlight: "Javier T. acaba de retirar $1,240 de su cuenta financiada",
      color: "text-green-400",
      live: false
    },
    { 
      icon: UserPlus, 
      text: "NUEVO MIEMBRO:", 
      highlight: "Diego F. (Ciudad del Este) se unió a la Academia hace 5m",
      color: "text-blue-400",
      live: false
    },
    { 
      icon: Clock, 
      text: "OFERTA FLASH:", 
      highlight: "El descuento del 85% expira automáticamente en breve",
      color: "text-amber-400",
      live: true
    },
     { 
      icon: TrendingUp, 
      text: "EN VIVO:", 
      highlight: "142 personas están revisando esta oferta ahora mismo",
      color: "text-purple-400",
      live: true
    }
  ];

  // Duplicamos los items para un loop infinito suave
  const marqueeContent = [...items, ...items, ...items, ...items];

  return (
    <div className="sticky top-0 z-[100] bg-black/95 backdrop-blur-sm border-b border-amber-500/20 py-2 md:py-3 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 80s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex w-max animate-marquee items-center">
        {marqueeContent.map((item, index) => (
          <div key={index} className="flex items-center mx-6 md:mx-10 select-none group cursor-pointer">
            
            {/* Icon Wrapper */}
            <div className={`mr-3 ${item.color} bg-white/5 p-1.5 rounded-full border border-white/5 group-hover:border-amber-500/30 transition-colors`}>
                <item.icon size={14} strokeWidth={2.5} />
            </div>

            {/* Text Content */}
            <span className="text-xs md:text-sm font-medium text-gray-300 tracking-wide flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold uppercase tracking-wider text-gray-500 group-hover:text-white transition-colors text-[10px] md:text-xs">{item.text}</span>
              <span className="text-gray-100 font-semibold group-hover:text-amber-500 transition-colors">
                {item.highlight}
              </span>
            </span>

            {/* Live Indicator Pulse - More aggressive red for urgency */}
            {item.live && (
                <div className="ml-2 relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </div>
            )}

            {/* Separator - Dot */}
            <div className="w-1 h-1 bg-white/20 rounded-full ml-12 md:ml-16"></div>
          </div>
        ))}
      </div>
      
      {/* Fading Edges */}
      <div className="absolute inset-y-0 left-0 w-8 md:w-24 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute inset-y-0 right-0 w-8 md:w-24 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};