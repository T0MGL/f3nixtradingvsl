import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface TestimonialImage {
  src: string;
  alt: string;
}

// In a real scenario, the user will upload images to /assets/testimonials/
// For now, we define some placeholders or look for files in that directory if possible.
const TESTIMONIAL_IMAGES: TestimonialImage[] = [
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.16 PM.jpeg', alt: 'Resultado Fenix 1' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.19 PM.jpeg', alt: 'Resultado Fenix 2' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.19 PM-2.jpeg', alt: 'Resultado Fenix 3' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.19 PM-3.jpeg', alt: 'Resultado Fenix 4' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.19 PM-4.jpeg', alt: 'Resultado Fenix 5' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.20 PM.jpeg', alt: 'Resultado Fenix 6' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.20 PM-2.jpeg', alt: 'Resultado Fenix 7' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.21 PM.jpeg', alt: 'Resultado Fenix 8' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.21 PM-2.jpeg', alt: 'Resultado Fenix 9' },
  { src: '/assets/testimonials/WhatsApp Image 2026-01-05 at 6.25.21 PM-3.jpeg', alt: 'Resultado Fenix 10' },
];

export const TestimonialCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full group py-8">
      <div className="flex flex-col mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-[1px] bg-amber-500/50"></div>
          <span className="text-amber-500 text-[10px] font-bold uppercase tracking-[0.2em]">Resultados de Estudiantes</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white leading-none">
          MÁS QUE PALABRAS, <span className="gold-gradient-text italic">RESULTADOS.</span>
        </h2>
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white border border-white/10 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 -ml-6 hidden md:flex"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white border border-white/10 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 -mr-6 hidden md:flex"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TESTIMONIAL_IMAGES.map((img, index) => (
            <div
              key={index}
              className="min-w-[280px] md:min-w-[320px] lg:min-w-[400px] aspect-[9/16] relative snap-start group/card"
            >
              <div className="absolute inset-0 rounded-2xl border border-white/10 overflow-hidden transform group-hover/card:scale-[1.02] transition-transform duration-500 shadow-2xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover opacity-90 group-hover/card:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/card:opacity-40 transition-opacity"></div>

                {/* Overlay details */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Verificado por Comunidad</span>
                  </div>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                <div className="absolute top-2 right-[-2.5rem] w-24 h-6 bg-amber-500/20 backdrop-blur-md rotate-45 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-[8px] font-black text-amber-500 uppercase">PRO</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};
