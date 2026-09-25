import React from 'react';
import { motion } from 'motion/react';
import { Search, Target, Share2, Megaphone, ArrowRight, BarChart3, TrendingUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface MarketingSectionProps {
  onStartMarketing: () => void;
}

export const MarketingSection: React.FC<MarketingSectionProps> = ({ onStartMarketing }) => {
  const marketingPillars = [
    {
      id: 'seo',
      title: 'Search Engine Optimization',
      subtitle: 'Technical, On-Page & Local Authority',
      icon: Search,
      deliverables: [
        'Structured schema markup & site architecture',
        'High-intent buyer keyword research',
        'Core Web Vitals & technical crawling health',
        'Google Business Profile & local visibility',
      ],
      impact: 'Drives sustainable, compounding organic inquiries over time without perpetual ad spend.',
    },
    {
      id: 'google-ads',
      title: 'Google Ads Management',
      subtitle: 'High-Intent Search & Performance Max',
      icon: Target,
      deliverables: [
        'Intent-focused search campaign structure',
        'Negative keyword gating to eliminate ad waste',
        'Dedicated high-conversion landing page design',
        'Granular conversion action tracking setup',
      ],
      impact: 'Puts your business directly in front of buyers actively searching to hire or purchase.',
    },
    {
      id: 'meta-ads',
      title: 'Meta Ads (Facebook & Instagram)',
      subtitle: 'Demographic & Retargeting Engines',
      icon: Share2,
      deliverables: [
        'Visual creative angle testing & iterations',
        'Granular demographic & interest segmentation',
        'Multi-stage warm retargeting funnels',
        'Conversions API (CAPI) server attribution',
      ],
      impact: 'Builds brand awareness and retargets interested prospects into booked consultations.',
    },
    {
      id: 'social-media',
      title: 'Social Media Marketing',
      subtitle: 'Content Direction & Community Authority',
      icon: Megaphone,
      deliverables: [
        'Strategic content calendar development',
        'High-resolution branded creative assets',
        'Consistent market presence & thought leadership',
        'Audience engagement & message management',
      ],
      impact: 'Cultivates enduring social proof and credibility that accelerates conversion across all channels.',
    },
  ];

  return (
    <section id="marketing" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              Multi-Channel Acquisition
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Performance Marketing & Digital Acquisition.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            A beautiful website is only half the battle. We build data-informed advertising, search, and social campaigns that reliably put your business in front of ideal clients.
          </p>
        </motion.div>

        {/* Illustrative Dashboard Preview Container (Clearly Labeled Sample View) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="mb-16 glass-level-2 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#38bdf8]/35 shadow-[0_28px_72px_rgba(5,11,20,0.92)] relative overflow-hidden"
        >
          {/* Top light rim */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#67e8f9]/70 to-transparent" />

          {/* Illustrative View Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                  Attribution & Performance Analytics
                </h3>
              </div>
              <p className="text-xs text-[#8ed5ff] mt-0.5">
                Multi-channel acquisition pipeline & conversion tracking architecture
              </p>
            </div>

            {/* Prominent Mandatory Label */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] sm:text-xs font-mono text-cyan-300 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Illustrative Dashboard — Sample Campaign View</span>
            </div>
          </div>

          {/* Dashboard Metrics Grid (Illustrative Sample Architecture) */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#050B14]/70 border border-white/[0.06]">
              <div className="text-[11px] font-display uppercase tracking-wider text-[#bdc8d1]/80">
                Primary Channel
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                Google Search
              </div>
              <div className="mt-1 text-[11px] font-mono text-[#38bdf8]">
                High-Intent Keywords
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B14]/70 border border-white/[0.06]">
              <div className="text-[11px] font-display uppercase tracking-wider text-[#bdc8d1]/80">
                Paid Social Engine
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                Meta Ads
              </div>
              <div className="mt-1 text-[11px] font-mono text-[#67e8f9]">
                Visual Retargeting
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B14]/70 border border-white/[0.06]">
              <div className="text-[11px] font-display uppercase tracking-wider text-[#bdc8d1]/80">
                Organic Discovery
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                Technical SEO
              </div>
              <div className="mt-1 text-[11px] font-mono text-[#8ed5ff]">
                Zero Ad Cost Traffic
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#050B14]/70 border border-white/[0.06]">
              <div className="text-[11px] font-display uppercase tracking-wider text-[#bdc8d1]/80">
                Tracking Infrastructure
              </div>
              <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-white">
                GA4 + CAPI
              </div>
              <div className="mt-1 text-[11px] font-mono text-emerald-400">
                Server-Side Verified
              </div>
            </div>
          </div>

          {/* Sample Funnel Visualization Bar */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl bg-[#03070E]/80 border border-white/[0.06]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#bdc8d1] mb-3">
              <span className="font-display font-semibold text-white">End-to-End Acquisition Funnel Mechanics:</span>
              <span className="font-mono text-[#38bdf8] text-[11px]">Structured Journey</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-display font-semibold text-[#8ed5ff]">1. High-Intent Traffic</div>
                <div className="text-[11px] text-[#bdc8d1]/75 mt-1">SEO & Paid Search capture qualified shoppers and business inquiries.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-display font-semibold text-[#8ed5ff]">2. Conversion Landing Page</div>
                <div className="text-[11px] text-[#bdc8d1]/75 mt-1">Sub-second loading speeds, clear value proposition, and instant forms.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-display font-semibold text-[#8ed5ff]">3. AI Lead Triage</div>
                <div className="text-[11px] text-[#bdc8d1]/75 mt-1">24/7 automated qualification ensures zero warm inquiries are missed.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="font-display font-semibold text-[#8ed5ff]">4. Retargeting Loop</div>
                <div className="text-[11px] text-[#bdc8d1]/75 mt-1">Meta Ads keep your brand top-of-mind until the contract is signed.</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-[#bdc8d1]/60 italic">
              * Dashboard mockup represents illustrative campaign architecture and attribution mechanics. We never present fabricated numbers as real client metrics.
            </span>
          </div>
        </motion.div>

        {/* 4 Detailed Marketing Pillars Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {marketingPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                variants={cardRevealVariant}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-level-1 p-6 sm:p-8 rounded-3xl border border-white/[0.08] hover:border-[#38bdf8]/45 hover:shadow-[0_24px_48px_-12px_rgba(5,11,20,0.9),0_0_24px_rgba(56,189,248,0.14)] flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#7bd0ff]">
                      {pillar.subtitle}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#050B14]/80 border border-white/[0.06] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all text-[#38bdf8]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                    {pillar.title}
                  </h3>

                  <div className="mt-5 space-y-2 pt-4 border-t border-white/[0.06]">
                    {pillar.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-[#a5c8ff]/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 p-3 rounded-xl bg-[#050B14]/60 border border-white/[0.04] text-xs text-[#bdc8d1] leading-relaxed">
                    <strong className="text-[#8ed5ff]">Strategic Advantage:</strong> {pillar.impact}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={onStartMarketing}
                    className="w-full btn-acrylic py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 group-hover:border-[#38bdf8]/50 transition-all text-white cursor-pointer"
                  >
                    <span>Request Strategy Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
