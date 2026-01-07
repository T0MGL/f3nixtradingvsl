import React, { useEffect, useState } from 'react';

interface StickyCTAProps {
    onCtaClick: () => void;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({ onCtaClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Determine visibility based on the Hero CTA position
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA only if the hero button is NOT intersecting
        // AND it's above the viewport (top < 0), meaning user scrolled past it.
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px"
      }
    );

    const target = document.getElementById('hero-cta');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-lg border-t border-amber-500/30 z-50 md:hidden transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <button 
            onClick={onCtaClick}
            className="w-full gold-gradient-bg btn-shimmer text-black font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] uppercase text-sm hover:scale-105 active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2"
        >
            SÍ, QUIERO SER RENTABLE HOY
        </button>
    </div>
  );
};