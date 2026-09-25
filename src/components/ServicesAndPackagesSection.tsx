import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Search,
  Bot,
  Zap,
  Target,
  Share2,
  Megaphone,
  Palette,
  Server,
  Check,
  ArrowRight,
  Sparkles,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { SERVICE_PACKAGES_DATA } from '../data/servicePackagesData';
import { ServicePackage, ServicePackageGroup } from '../types';
import { fadeUpVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface ServicesAndPackagesSectionProps {
  onSelectPackage: (serviceTitle: string, packageTier: ServicePackage) => void;
  onCustomQuote: () => void;
  /** Controlled active service index */
  selectedServiceIndex?: number;
  onServiceIndexChange?: (index: number) => void;
}

const ROTATION_INTERVAL_MS = 6500;

export const ServicesAndPackagesSection: React.FC<ServicesAndPackagesSectionProps> = ({
  onSelectPackage,
  onCustomQuote,
  selectedServiceIndex,
  onServiceIndexChange,
}) => {
  const [internalServiceIndex, setInternalServiceIndex] = useState<number>(0);
  const activeServiceIndex = selectedServiceIndex !== undefined ? selectedServiceIndex : internalServiceIndex;

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [progressKey, setProgressKey] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Selector pill bar container ref for horizontal scrolling
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Check user prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Safe navigation handlers with direct index calculation to avoid stale closures
  const goToNextService = useCallback(() => {
    setSlideDirection('next');
    const nextIndex = (activeServiceIndex + 1) % SERVICE_PACKAGES_DATA.length;
    setInternalServiceIndex(nextIndex);
    onServiceIndexChange?.(nextIndex);
    setProgressKey((k) => k + 1);
  }, [activeServiceIndex, onServiceIndexChange]);

  const goToPrevService = useCallback(() => {
    setSlideDirection('prev');
    const prevIndex = (activeServiceIndex - 1 + SERVICE_PACKAGES_DATA.length) % SERVICE_PACKAGES_DATA.length;
    setInternalServiceIndex(prevIndex);
    onServiceIndexChange?.(prevIndex);
    setProgressKey((k) => k + 1);
  }, [activeServiceIndex, onServiceIndexChange]);

  const handleSelectService = (index: number) => {
    if (index === activeServiceIndex) return;
    setSlideDirection(index > activeServiceIndex ? 'next' : 'prev');
    setInternalServiceIndex(index);
    onServiceIndexChange?.(index);
    setProgressKey((k) => k + 1);
  };

  // Auto-rotation timer
  useEffect(() => {
    if (isPaused || isReducedMotion) return;

    const timer = setInterval(() => {
      goToNextService();
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isPaused, isReducedMotion, goToNextService, activeServiceIndex]);

  // Keep active pill in view when changed
  useEffect(() => {
    const activeBtn = tabButtonRefs.current[activeServiceIndex];
    if (activeBtn && tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: isReducedMotion ? 'instant' : 'smooth',
      });
    }
  }, [activeServiceIndex, isReducedMotion]);

  const currentService: ServicePackageGroup =
    SERVICE_PACKAGES_DATA[activeServiceIndex] || SERVICE_PACKAGES_DATA[0];

  const getServiceIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Globe':
        return <Globe className={className} />;
      case 'Search':
        return <Search className={className} />;
      case 'Bot':
        return <Bot className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Share2':
        return <Share2 className={className} />;
      case 'Megaphone':
        return <Megaphone className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      case 'Server':
        return <Server className={className} />;
      default:
        return <Globe className={className} />;
    }
  };

  return (
    <section
      id="packages"
      className="py-24 relative overflow-hidden"
      aria-label="Services and 4-Tier Packages Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        // Only resume if focus leaves the entire section
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume after 5 seconds of idle touch
        setTimeout(() => setIsPaused(false), 5000);
      }}
    >
      {/* Subtle backdrop ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#38bdf8]/10 via-[#0c2b52]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              Complete Growth Architecture
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Services &amp; Packages
          </h2>

          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            Explore our services and see exactly what each package includes — from getting started to fully customized growth solutions.
          </p>

          {/* Dynamic Auto-Rotation Status & Controls Bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-2xl sm:rounded-full glass-level-1 border border-white/[0.08] shadow-sm max-w-full">
            {/* Auto indicator pill */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="relative flex h-2 w-2">
                {!isPaused && !isReducedMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isPaused ? 'bg-amber-400' : 'bg-[#38bdf8]'
                  }`}
                />
              </span>
              <span className="font-mono text-[11px] text-[#7bd0ff] tracking-wide">
                {isPaused
                  ? 'Showcase Paused'
                  : isReducedMotion
                  ? 'Manual Mode'
                  : 'Auto-cycling Services'}
              </span>
            </div>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPaused((prev) => !prev);
              }}
              aria-label={isPaused ? 'Resume auto rotation' : 'Pause auto rotation'}
              className="p-1.5 rounded-lg text-[#bdc8d1] hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
              title={isPaused ? 'Resume auto showcase' : 'Pause auto showcase'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#38bdf8]" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            {/* Prev / Next controls */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevService();
                }}
                aria-label="Previous service"
                className="p-1.5 rounded-lg text-[#bdc8d1] hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
                title="Previous service"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-white font-medium px-1.5 select-none">
                {activeServiceIndex + 1} / {SERVICE_PACKAGES_DATA.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNextService();
                }}
                aria-label="Next service"
                className="p-1.5 rounded-lg text-[#bdc8d1] hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer"
                title="Next service"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* 9-Service Interactive Selector Tabs */}
        <div className="relative mb-6 sm:mb-8">
          {/* Scroll fade gradients for mobile and tablet touch */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-[#03070E] to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-[#03070E] to-transparent pointer-events-none z-10" />

          <div
            ref={tabsContainerRef}
            role="tablist"
            aria-label="Services list"
            className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-2 px-2 sm:px-1 scroll-smooth touch-pan-x overscroll-x-contain"
          >
            {SERVICE_PACKAGES_DATA.map((serviceGroup, idx) => {
              const isActive = idx === activeServiceIndex;
              return (
                <button
                  key={serviceGroup.serviceId}
                  ref={(el) => { tabButtonRefs.current[idx] = el; }}
                  role="tab"
                  id={`tab-${serviceGroup.serviceId}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${serviceGroup.serviceId}`}
                  onClick={() => handleSelectService(idx)}
                  className={`group relative px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-display font-medium whitespace-nowrap transition-all duration-300 flex items-center space-x-2.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0c2b52] to-[#184b82] text-white border-2 border-[#38bdf8] shadow-[0_0_24px_rgba(56,189,248,0.35)] scale-[1.02]'
                      : 'glass-level-1 border border-white/[0.08] text-[#bdc8d1] hover:text-white hover:border-[#38bdf8]/40 hover:bg-white/[0.06]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#38bdf8]/20 text-[#67e8f9]'
                        : 'bg-white/[0.04] text-[#7bd0ff] group-hover:text-white'
                    }`}
                  >
                    {getServiceIcon(serviceGroup.iconName, 'w-3.5 h-3.5')}
                  </div>

                  <span className="font-mono text-[11px] font-bold opacity-75">
                    {serviceGroup.serviceNumber}
                  </span>

                  <span className="font-semibold">{serviceGroup.serviceTitle}</span>

                  {/* Visual auto-rotation progress bar inside active pill */}
                  {isActive && !isPaused && !isReducedMotion && (
                    <motion.div
                      key={progressKey}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ROTATION_INTERVAL_MS / 1000, ease: 'linear' }}
                      style={{ originX: 0 }}
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#38bdf8] rounded-full shadow-[0_0_8px_#38bdf8]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Active Service Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentService.serviceId}
            id={`panel-${currentService.serviceId}`}
            role="tabpanel"
            aria-labelledby={`tab-${currentService.serviceId}`}
            initial={{
              opacity: 0,
              y: isReducedMotion ? 0 : 16,
              filter: isReducedMotion ? 'none' : 'blur(4px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              y: isReducedMotion ? 0 : -16,
              filter: isReducedMotion ? 'none' : 'blur(4px)',
            }}
            transition={{ duration: isReducedMotion ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Active Service Overview Banner */}
            <div className="glass-level-2 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#38bdf8]/30 shadow-[0_20px_50px_rgba(5,11,20,0.85)] flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6 relative overflow-hidden">
              {/* Corner cyan gradient accent */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

              <div className="flex items-start space-x-3.5 sm:space-x-4 relative z-10">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#050B14] border border-[#38bdf8]/40 shadow-inner shrink-0 text-[#38bdf8]">
                  {getServiceIcon(currentService.iconName, 'w-5 h-5 sm:w-7 sm:h-7')}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-y-1">
                    <span className="font-mono text-xs font-bold text-[#38bdf8] px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30">
                      Service {currentService.serviceNumber} of 09
                    </span>
                    <span className="text-xs text-[#67e8f9] font-display uppercase tracking-wider font-semibold">
                      {currentService.category}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">
                    {currentService.serviceTitle} Packages
                  </h3>

                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-[#bdc8d1] max-w-3xl leading-relaxed">
                    {currentService.shortDescription}
                  </p>
                </div>
              </div>

              {/* Service Navigation Jump & Scope Indicator */}
              <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.08] relative z-10">
                <div className="text-left md:text-right">
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#7bd0ff] uppercase tracking-wider block">
                    Tailored Quotation
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    4 Distinct Tiers
                  </span>
                </div>
              </div>
            </div>

            {/* Special Disclaimer / Transparency Notice if present (e.g. SEO algorithm realities, Ad Spend separation) */}
            {currentService.disclaimer && (
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/35 flex items-start space-x-3 text-xs sm:text-sm text-[#dce3f0] shadow-sm">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white font-semibold">Important Transparency Notice: </strong>
                  {currentService.disclaimer}
                </div>
              </div>
            )}

            {/* 4 Packages Grid: STARTER | BUSINESS | PREMIUM | CUSTOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
              {currentService.packages.map((pkg) => {
                const isBusiness = pkg.level === 'BUSINESS';
                const isCustom = pkg.level === 'CUSTOM';

                return (
                  <motion.div
                    key={pkg.level}
                    whileHover={{ y: isBusiness ? -8 : -5 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`rounded-2xl sm:rounded-3xl p-5 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                      isBusiness
                        ? 'glass-level-2 border-2 border-[#38bdf8] shadow-[0_24px_64px_-12px_rgba(56,189,248,0.28)] bg-gradient-to-b from-[#0e223d]/85 to-[#071325]/90'
                        : 'glass-level-1 border border-white/[0.08] hover:border-[#38bdf8]/45 hover:shadow-[0_20px_45px_-10px_rgba(5,11,20,0.85)] bg-[#050B14]/65'
                    }`}
                  >
                    {/* Badge: Business Recommended or Popular */}
                    {pkg.badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#184b82] to-[#38bdf8] text-white text-[10px] font-display font-bold uppercase tracking-widest shadow-md flex items-center justify-center whitespace-nowrap">
                        <span>{pkg.badge}</span>
                      </div>
                    )}

                    <div>
                      {/* Tier Identifier */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#67e8f9] px-2.5 py-0.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20">
                          Tier {pkg.level}
                        </span>
                        {isBusiness && (
                          <span className="text-[10px] font-mono text-[#38bdf8] font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>

                      {/* Package Name */}
                      <h4 className="font-display text-2xl font-bold text-white tracking-tight">
                        {pkg.name}
                      </h4>

                      {/* Tagline / Target Audience */}
                      <p className="text-xs sm:text-sm text-[#7bd0ff] font-medium mt-1.5 min-h-[38px] flex items-center leading-snug">
                        {pkg.tagline}
                      </p>

                      {/* Price Display */}
                      <div className="mt-4 pb-4 border-b border-white/[0.08]">
                        <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {pkg.priceDisplay}
                        </div>
                        <div className="text-[11px] text-[#bdc8d1]/70 font-mono mt-0.5">
                          Tailored quote based on your specific scope
                        </div>
                      </div>

                      {/* Inclusions List */}
                      <div className="mt-5 space-y-3">
                        <div className="text-[11px] font-display font-bold uppercase tracking-wider text-[#a5c8ff] flex items-center justify-between">
                          <span>Package Inclusions:</span>
                          <span className="font-mono text-[10px] text-[#38bdf8]/80 font-normal">
                            {pkg.inclusions.length} deliverables
                          </span>
                        </div>

                        <ul className="space-y-2.5">
                          {pkg.inclusions.map((inclusion, idx) => (
                            <li
                              key={idx}
                              className="flex items-start space-x-2.5 text-xs sm:text-sm text-[#dce3f0] leading-relaxed"
                            >
                              <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                              <span>{inclusion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Strategic Note */}
                      {pkg.note && (
                        <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-[11px] text-[#bdc8d1]/85 italic leading-relaxed">
                          {pkg.note}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 pt-5 border-t border-white/[0.08]">
                      <button
                        onClick={() => onSelectPackage(currentService.serviceTitle, pkg)}
                        className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                          isBusiness
                            ? 'btn-primary-luminescence shadow-lg'
                            : isCustom
                            ? 'btn-acrylic border-[#38bdf8]/40 hover:border-[#38bdf8] text-white'
                            : 'btn-acrylic hover:border-[#38bdf8]/50'
                        }`}
                      >
                        <span>{isCustom ? 'Request Custom Architecture' : 'Request a Quote'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Multi-Service & Enterprise Guidance Bar */}
            <div className="glass-level-1 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center shrink-0 text-[#38bdf8]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-display font-bold text-white">
                    Need a Unified Multi-Service Package or Growth Retainer?
                  </h5>
                  <p className="text-xs sm:text-sm text-[#bdc8d1] mt-0.5 leading-relaxed">
                    We bundle website development, AI assistants, automated operational pipelines, and paid ad management into seamless, single-partner contracts.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={onCustomQuote}
                  className="btn-primary-luminescence w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-white cursor-pointer shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Build Custom Cross-Service Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
