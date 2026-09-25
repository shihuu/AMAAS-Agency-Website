import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, ChevronRight, Globe2, ShieldCheck, Cpu } from 'lucide-react';
import { TRUST_STATS } from '../data';
import { AmaasLogo } from './AmaasLogo';
import { EASE_PREMIUM } from '../lib/motion';

interface HeroSectionProps {
  onStartProject: () => void;
  onViewWork: () => void;
  onGetQuote: () => void;
  content?: Record<string, string>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartProject,
  onViewWork,
  onGetQuote,
  content = {},
}) => {
  const badgeText = content['hero.badge'] || 'DIGITAL GROWTH & TECHNOLOGY AGENCY';
  const headlineText = content['hero.headline'] || 'Digital Growth, Built Around';
  const subheadlineText = content['hero.subheadline'] || 'Your Business.';
  const philosophyText = content['hero.philosophy'] || "We combine technology, AI, creative design and performance marketing to help businesses build, reach and convert.";
  const primaryCta = content['hero.primary_cta_text'] || 'Start a Project';
  const secondaryCta = content['hero.secondary_cta_text'] || 'Explore Services';
  // Desktop mouse parallax coordinates for the showcase card
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply on fine-pointer desktop devices
    if (window.matchMedia('(pointer: fine)').matches) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({ x: x * 8, y: y * 8 }); // subtle 4px movement
    }
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHoveringCard(false);
  };

  return (
    <section id="home" className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Text Container with sequential reveal */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Eyebrow - Professional Positioning */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE_PREMIUM }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 shadow-[0_0_20px_rgba(56,189,248,0.15)] mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="text-xs font-display font-bold uppercase tracking-[0.18em] text-[#67e8f9]">
              {badgeText}
            </span>
          </motion.div>

          {/* Main Headline with blur-to-sharp fade */}
          <motion.h1
            initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_PREMIUM }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-white leading-[1.1] sm:leading-[1.12]"
          >
            {headlineText}{' '}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-[#8ed5ff] via-[#38bdf8] to-[#67e8f9] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
              {subheadlineText}
            </span>
          </motion.h1>

          {/* Core Philosophy Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE_PREMIUM }}
            className="mt-4 font-display text-base sm:text-xl font-medium tracking-wide text-[#7bd0ff] max-w-2xl"
          >
            "{philosophyText.replace(/^["']|["']$/g, '')}"
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: EASE_PREMIUM }}
            className="mt-4 text-base sm:text-lg text-[#bdc8d1] max-w-2xl font-normal leading-relaxed"
          >
            AMAAS combines technology, AI, creative design and performance marketing to help businesses build, reach and convert worldwide.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease: EASE_PREMIUM }}
            className="mt-8 sm:mt-9 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onStartProject}
              className="btn-primary-luminescence w-full sm:w-auto px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 cursor-pointer group shadow-lg"
            >
              <span>{primaryCta}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onViewWork}
              className="btn-acrylic w-full sm:w-auto px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{secondaryCta}</span>
            </button>

            <button
              onClick={onGetQuote}
              className="w-full sm:w-auto px-5 py-3 rounded-full text-sm font-medium text-[#8ed5ff] hover:text-white transition-all duration-200 flex items-center justify-center space-x-1.5 hover:bg-white/[0.04] active:scale-95 cursor-pointer"
            >
              <span>Request a Quote</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Hero Visual Glass Showcase (Apple VisionOS Luxury Style) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.6, ease: EASE_PREMIUM }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringCard(true)}
          onMouseLeave={handleMouseLeave}
          className="mt-14 sm:mt-20 max-w-5xl mx-auto"
        >
          <motion.div
            animate={{
              x: mouseOffset.x,
              y: mouseOffset.y,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-level-2 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#38bdf8]/35 relative shadow-[0_32px_80px_-16px_rgba(5,11,20,0.95)] overflow-hidden transition-all duration-300 hover:border-[#38bdf8]/50 hover:shadow-[0_36px_90px_-16px_rgba(5,11,20,0.98),0_0_30px_rgba(56,189,248,0.18)]"
          >
            
            {/* Top Light Catchment Rim */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#67e8f9]/70 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Brand Feature */}
              <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/[0.08] pb-6 md:pb-0 md:pr-6">
                <div className="transition-transform duration-300 hover:scale-105">
                  <AmaasLogo size="lg" />
                </div>
                <div className="mt-3 text-xs font-display font-semibold uppercase tracking-wider text-[#8ed5ff]">
                  Technology &bull; Marketing &bull; AI &bull; Creative
                </div>
                <div className="mt-2 text-xs text-[#bdc8d1] leading-relaxed">
                  Combining modern web engineering, practical AI automation, and performance marketing to scale ambitious brands.
                </div>
                <div className="mt-4 flex items-center space-x-2 text-[11px] text-[#67e8f9] font-display font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
                  <span>Now Booking Q4 Strategic Client Partnerships</span>
                </div>
              </div>

              {/* Right Showcase Highlights */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#050B14]/60 border border-white/[0.06] flex flex-col justify-between hover:border-[#38bdf8]/30 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="text-xs font-display font-bold uppercase tracking-wider text-[#7bd0ff] flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Marketing & Digital Growth</span>
                  </div>
                  <div className="mt-2 text-sm text-white font-medium">
                    Google Ads, Meta Ads, Technical SEO & Social Content Strategy.
                  </div>
                  <div className="mt-3 text-[11px] text-[#bdc8d1]/75 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Multi-channel customer acquisition</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14]/60 border border-white/[0.06] flex flex-col justify-between hover:border-[#38bdf8]/30 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="text-xs font-display font-bold uppercase tracking-wider text-[#7bd0ff] flex items-center space-x-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Technology & AI Systems</span>
                  </div>
                  <div className="mt-2 text-sm text-white font-medium">
                    Fast responsive web development, 24/7 AI chatbots & workflow automation.
                  </div>
                  <div className="mt-3 text-[11px] text-[#bdc8d1]/75 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Modern, future-proof architectures</span>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        </motion.div>

        {/* 7. TRUST / STATS SECTION with staggered reveal */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.72 + idx * 0.08, ease: EASE_PREMIUM }}
                className="glass-level-1 p-5 rounded-2xl border border-white/[0.08] text-center hover:border-[#38bdf8]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(56,189,248,0.12)] cursor-default"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium text-[#8ed5ff]/90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

