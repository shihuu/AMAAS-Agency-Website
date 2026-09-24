import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  ArrowRight,
  Globe,
  Search,
  Bot,
  Zap,
  Target,
  Share2,
  Megaphone,
  Palette,
  Server,
  AlertCircle,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SERVICE_PACKAGES_DATA } from '../data/servicePackagesData';
import { ServicePackage, ServicePackageGroup } from '../types';

interface ServicePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceTitle?: string;
  onSelectPackage: (serviceTitle: string, packageTier: ServicePackage) => void;
}

export const ServicePackagesModal: React.FC<ServicePackagesModalProps> = ({
  isOpen,
  onClose,
  initialServiceTitle,
  onSelectPackage,
}) => {
  // Find initial service index
  const findInitialIndex = () => {
    if (!initialServiceTitle) return 0;
    const matchIdx = SERVICE_PACKAGES_DATA.findIndex(
      (s) =>
        s.serviceTitle.toLowerCase() === initialServiceTitle.toLowerCase() ||
        initialServiceTitle.toLowerCase().includes(s.serviceTitle.toLowerCase()) ||
        s.serviceTitle.toLowerCase().includes(initialServiceTitle.toLowerCase())
    );
    return matchIdx >= 0 ? matchIdx : 0;
  };

  const [activeServiceIndex, setActiveServiceIndex] = useState<number>(findInitialIndex);

  // When initialServiceTitle changes, sync active tab
  useEffect(() => {
    if (isOpen && initialServiceTitle) {
      const idx = findInitialIndex();
      setActiveServiceIndex(idx);
    }
  }, [isOpen, initialServiceTitle]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentService: ServicePackageGroup =
    SERVICE_PACKAGES_DATA[activeServiceIndex] || SERVICE_PACKAGES_DATA[0];

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-5 h-5 text-[#38bdf8]" />;
      case 'Search':
        return <Search className="w-5 h-5 text-[#67e8f9]" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-[#8ed5ff]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#7bd0ff]" />;
      case 'Target':
        return <Target className="w-5 h-5 text-[#38bdf8]" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-[#5bdeef]" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-[#67e8f9]" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-[#8ed5ff]" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#38bdf8]" />;
      default:
        return <Globe className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AMAAS Service Packages Breakdown"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#050B14]/85 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-7xl max-h-[92vh] bg-[#070e1b] border border-white/[0.12] rounded-2xl sm:rounded-3xl shadow-[0_32px_96px_-16px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.15)] flex flex-col overflow-hidden z-10"
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-5 border-b border-white/[0.08] bg-[#050B14]/80 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30">
              <Layers className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-display uppercase tracking-widest text-[#38bdf8] font-semibold">
                  AMAAS Package Architecture
                </span>
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
                <span className="hidden sm:inline-block text-[11px] text-[#bdc8d1]/70">
                  4 Tiers for Each Discipline
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white leading-snug">
                Service Packages & Scope Inclusions
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close packages dialog"
            className="p-2 sm:p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] hover:border-white/[0.2] text-[#bdc8d1] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Service Selector Pills */}
        <div className="border-b border-white/[0.08] bg-[#040810]/70 px-4 sm:px-8 py-3 shrink-0 overflow-x-auto scrollbar-none flex items-center space-x-2">
          {SERVICE_PACKAGES_DATA.map((serviceGroup, idx) => {
            const isActive = idx === activeServiceIndex;
            return (
              <button
                key={serviceGroup.serviceId}
                onClick={() => setActiveServiceIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-display font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#38bdf8]/20 border border-[#38bdf8] text-white shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                    : 'bg-white/[0.03] border border-white/[0.06] text-[#bdc8d1] hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <span
                  className={`font-mono text-[10px] font-bold ${
                    isActive ? 'text-[#38bdf8]' : 'text-[#a5c8ff]/60'
                  }`}
                >
                  {serviceGroup.serviceNumber}
                </span>
                <span>{serviceGroup.serviceTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin">
          {/* Active Service Banner */}
          <div className="glass-level-1 p-5 sm:p-6 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3.5 rounded-2xl bg-[#050B14] border border-[#38bdf8]/30 shrink-0">
                {getServiceIcon(currentService.iconName)}
              </div>
              <div>
                <div className="flex items-center space-x-2.5 mb-1.5 flex-wrap gap-y-1">
                  <span className="font-mono text-xs font-bold text-[#38bdf8] px-2 py-0.5 rounded bg-[#38bdf8]/10 border border-[#38bdf8]/20">
                    Service {currentService.serviceNumber}
                  </span>
                  <span className="text-xs text-[#67e8f9] font-display uppercase tracking-wider font-semibold">
                    {currentService.category}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {currentService.serviceTitle} Packages
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#bdc8d1] max-w-3xl leading-relaxed">
                  {currentService.shortDescription}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
              <span className="text-[11px] font-mono text-[#7bd0ff] uppercase tracking-wider">
                Quotation Model
              </span>
              <span className="text-sm font-semibold text-white">
                Custom Tailored Scope
              </span>
            </div>
          </div>

          {/* Special Service Disclaimer (e.g. Ad Spend or SEO Rank reality) */}
          {currentService.disclaimer && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-start space-x-3 text-xs sm:text-sm text-[#dce3f0]">
              <AlertCircle className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-white font-semibold">Important Transparency Notice: </strong>
                {currentService.disclaimer}
              </div>
            </div>
          )}

          {/* 4 Packages Grid: STARTER, BUSINESS, PREMIUM, CUSTOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {currentService.packages.map((pkg) => {
              const isBusiness = pkg.level === 'BUSINESS';
              return (
                <div
                  key={pkg.level}
                  className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 relative ${
                    isBusiness
                      ? 'glass-level-2 border-2 border-[#38bdf8] shadow-[0_20px_50px_-10px_rgba(56,189,248,0.25)] bg-[#0c1a2f]/70'
                      : 'glass-level-1 border border-white/[0.08] hover:border-[#38bdf8]/40 hover:shadow-[0_16px_36px_-10px_rgba(5,11,20,0.9)] bg-[#070f1e]/60'
                  }`}
                >
                  {/* Recommended Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#184b82] to-[#38bdf8] text-white text-[10px] font-display font-bold uppercase tracking-widest shadow-md flex items-center justify-center whitespace-nowrap">
                      <span>{pkg.badge}</span>
                    </div>
                  )}

                  <div>
                    {/* Tier Title */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#67e8f9] px-2 py-0.5 rounded bg-[#38bdf8]/10">
                        {pkg.level}
                      </span>
                    </div>

                    <h4 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {pkg.name}
                    </h4>

                    {/* Tagline */}
                    <p className="text-xs text-[#7bd0ff] font-medium mt-1 min-h-[32px] flex items-center">
                      {pkg.tagline}
                    </p>

                    {/* Price display: Always custom quotation per brief */}
                    <div className="mt-3.5 pb-4 border-b border-white/[0.08]">
                      <div className="font-display text-2xl font-bold text-white tracking-tight">
                        {pkg.priceDisplay}
                      </div>
                      <div className="text-[11px] text-[#bdc8d1]/70 font-mono mt-0.5">
                        Structured around your exact scope
                      </div>
                    </div>

                    {/* Inclusions List */}
                    <div className="mt-5 space-y-3">
                      <div className="text-[11px] font-display font-bold uppercase tracking-wider text-[#a5c8ff]">
                        Scope Inclusions:
                      </div>
                      <ul className="space-y-2.5">
                        {pkg.inclusions.map((inclusion, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-2.5 text-xs text-[#dce3f0] leading-relaxed"
                          >
                            <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Note */}
                    {pkg.note && (
                      <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-[11px] text-[#bdc8d1]/80 italic leading-snug">
                        {pkg.note}
                      </div>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="mt-6 pt-5 border-t border-white/[0.08]">
                    <button
                      onClick={() => onSelectPackage(currentService.serviceTitle, pkg)}
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        isBusiness
                          ? 'btn-primary-luminescence shadow-lg'
                          : 'btn-acrylic hover:border-[#38bdf8]/50'
                      }`}
                    >
                      <span>Request a Quote</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Guidance & Custom Consultation Note */}
          <div className="glass-level-1 p-5 rounded-2xl border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div>
                <h5 className="text-sm font-display font-bold text-white">
                  Need a Multi-Service Solution or Retainer?
                </h5>
                <p className="text-xs text-[#bdc8d1] mt-0.5">
                  We combine web engineering, AI chatbots, automation, and paid ad management into unified growth partnerships.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                onSelectPackage(currentService.serviceTitle, {
                  level: 'CUSTOM',
                  name: `${currentService.serviceTitle} (Custom Plan)`,
                  tagline: 'Multi-discipline tailored solution',
                  priceDisplay: 'Custom Quote',
                  inclusions: ['Full scope consultation & multi-service architecture'],
                })
              }
              className="btn-primary-luminescence px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer shadow-md shrink-0 flex items-center space-x-2"
            >
              <span>Build Custom Multi-Service Scope</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="px-5 sm:px-8 py-3.5 border-t border-white/[0.08] bg-[#050B14]/90 flex items-center justify-between text-xs text-[#bdc8d1]/70 shrink-0">
          <div className="flex items-center space-x-2">
            <span>Viewing:</span>
            <strong className="text-white font-medium">
              {currentService.serviceNumber} — {currentService.serviceTitle}
            </strong>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="text-xs text-[#bdc8d1] hover:text-white underline cursor-pointer"
            >
              Close & Back to Services
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
