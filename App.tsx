import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero';
import { AnnouncementBar } from './components/AnnouncementBar';
import { LeadFormModal } from './components/LeadFormModal';
import { StickyCTA } from './components/StickyCTA';
import { initPixel, trackEvent } from './utils/metaPixel';
import { Gateway } from './components/Gateway';
import { BotLanding } from './pages/BotLanding'; // Importing directly as it's a new page

// --- LAZY LOAD COMPONENTS (Performance Optimization) ---
// We use a helper to handle named exports with React.lazy
const lazyLoad = (importFunc: any, componentName: string) => {
  return React.lazy(() => importFunc.then((module: any) => ({ default: module[componentName] })));
};

const ProblemSolution = lazyLoad(import('./components/ProblemSolution'), 'ProblemSolution');
const TheStack = lazyLoad(import('./components/TheStack'), 'TheStack');
const SocialProof = lazyLoad(import('./components/SocialProof'), 'SocialProof');
const Pricing = lazyLoad(import('./components/Pricing'), 'Pricing');
const FAQ = lazyLoad(import('./components/FAQ'), 'FAQ');
const Footer = lazyLoad(import('./components/Footer'), 'Footer');
const RevealOnScroll = lazyLoad(import('./components/RevealOnScroll'), 'RevealOnScroll');
const WhoIsThisFor = lazyLoad(import('./components/WhoIsThisFor'), 'WhoIsThisFor');
const Guarantee = lazyLoad(import('./components/Guarantee'), 'Guarantee');

// Lazy load pages
const AdminDashboard = lazyLoad(import('./pages/AdminDashboard'), 'AdminDashboard');
const PrivacyPolicy = lazyLoad(import('./pages/LegalPages'), 'PrivacyPolicy');
const TermsConditions = lazyLoad(import('./pages/LegalPages'), 'TermsConditions');

// Loading Fallback Component
const LoadingSpinner = () => (
  <div className="py-20 flex justify-center items-center bg-black">
    <div className="w-8 h-8 border-4 border-amber-900 border-t-amber-500 rounded-full animate-spin"></div>
  </div>
);

// Academy Page Component (Formerly LandingPage) - VSL WITH META PIXEL
const AcademyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Meta Pixel ONLY for VSL route
  useEffect(() => {
    initPixel();
    trackEvent('PageView');
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    // Trackeamos que alguien abrió el formulario (Intención alta)
    trackEvent('ViewContent', { content_name: 'Lead Form Modal' });
  };

  const closeModal = () => setIsModalOpen(false);

  // CTA Click Handler wrapper to track initiation
  const handleCtaClick = (source: string) => {
    trackEvent('InitiateCheckout', { content_name: source });
    openModal();
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden selection:bg-amber-500/30 selection:text-white">
      {/* Top Bar - Dynamic Marquee */}
      <AnnouncementBar />

      {/* Hero is EAGER loaded (Critical for LCP) */}
      <Hero onCtaClick={() => handleCtaClick('Hero Section')} />

      {/* All other sections are LAZY loaded wrapped in Suspense */}
      <Suspense fallback={<div className="h-20 bg-black" />}>
        <RevealOnScroll>
          <SocialProof />
        </RevealOnScroll>

        <RevealOnScroll>
          <ProblemSolution />
        </RevealOnScroll>

        {/* Inserted Audience Filter for Psychology */}
        <RevealOnScroll>
          <WhoIsThisFor />
        </RevealOnScroll>

        <RevealOnScroll>
          <TheStack />
        </RevealOnScroll>

        {/* Inserted Guarantee before pricing to reduce risk */}
        <RevealOnScroll>
          <Guarantee />
        </RevealOnScroll>

        <RevealOnScroll>
          <Pricing onCtaClick={() => handleCtaClick('Pricing Section')} />
        </RevealOnScroll>

        <RevealOnScroll>
          <FAQ />
        </RevealOnScroll>

        <Footer />
        <StickyCTA onCtaClick={() => handleCtaClick('Sticky Footer')} />
      </Suspense>

      {/* The Lead Modal */}
      <LeadFormModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

const App: React.FC = () => {
  const location = useLocation();

  // Removed global pixel initialization - now only on VSL route

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Gateway />} />
        <Route path="/vsl" element={<AcademyPage />} />
        <Route path="/ai" element={<BotLanding />} />
        <Route path="/crm" element={<AdminDashboard />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos" element={<TermsConditions />} />
      </Routes>
    </Suspense>
  );
};

export default App;