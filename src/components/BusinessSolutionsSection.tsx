import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, Target, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface BusinessSolutionsSectionProps {
  onSelectSolution: (solutionName: string) => void;
}

export const BusinessSolutionsSection: React.FC<BusinessSolutionsSectionProps> = ({ onSelectSolution }) => {
  const solutions = [
    {
      id: 'get-more-customers',
      number: '01',
      title: 'Get More Customers',
      tagline: 'High-Intent Acquisition Engine',
      summary: 'Turn cold search intent and social feeds into an active, predictable stream of qualified buyer inquiries.',
      icon: Users,
      badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/30',
      channels: [
        { name: 'SEO', role: 'Captures high-intent organic searchers' },
        { name: 'Google Ads', role: 'Immediate top-of-search intent capture' },
        { name: 'Meta Ads', role: 'Visual demographic & behavioral targeting' },
        { name: 'Social Media', role: 'Authority, social proof & engagement' },
      ],
      resultBenefit: 'Predictable multi-channel lead flow with lower customer acquisition cost.',
    },
    {
      id: 'convert-more-visitors',
      number: '02',
      title: 'Convert More Visitors',
      tagline: 'Conversion Architecture & UX',
      summary: 'Eliminate bounce rates and friction so prospective clients seamlessly trust, explore, and reach out.',
      icon: Target,
      badgeColor: 'text-[#67e8f9] bg-[#67e8f9]/10 border-[#67e8f9]/30',
      channels: [
        { name: 'Custom Website', role: 'Sub-second speeds & credibility' },
        { name: 'UI/UX Design', role: 'Frictionless conversion journeys' },
        { name: 'AI Chatbot', role: 'Instant 24/7 engagement & lead capture' },
      ],
      resultBenefit: 'Higher visitor-to-lead conversion rates on all incoming traffic.',
    },
    {
      id: 'save-time',
      number: '03',
      title: 'Save Time & Automate',
      tagline: 'Operational Automation',
      summary: 'Replace manual back-and-forth communication and repetitive administrative tasks with intelligent systems.',
      icon: Clock,
      badgeColor: 'text-[#8ed5ff] bg-[#8ed5ff]/10 border-[#8ed5ff]/30',
      channels: [
        { name: 'AI Automation', role: 'Sync data across tools without manual effort' },
        { name: 'AI Chatbot', role: 'Answers FAQs, qualifies leads & routes briefs' },
      ],
      resultBenefit: 'Hours of operational time reclaimed every week for high-value work.',
    },
    {
      id: 'build-digital-presence',
      number: '04',
      title: 'Build a Strong Digital Presence',
      tagline: 'Authority & Market Presence',
      summary: 'Establish an authoritative, modern digital footprint that commands respect and justifies premium pricing.',
      icon: ShieldCheck,
      badgeColor: 'text-[#5bdeef] bg-[#5bdeef]/10 border-[#5bdeef]/30',
      channels: [
        { name: 'Branding & UI/UX', role: 'Distinctive visual identity & polish' },
        { name: 'Custom Website', role: 'Fast, secure, and modern brand flagship' },
        { name: 'Social Media', role: 'Consistent storytelling & market presence' },
      ],
      resultBenefit: 'Instant market credibility that sets your business far ahead of competitors.',
    },
  ];

  return (
    <section id="solutions" className="py-24 relative overflow-hidden">
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
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              Integrated Approach
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            More Than Services. Practical Digital Solutions.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            We don't sell isolated tactics. We engineer cohesive digital growth systems that address the core bottlenecks in your business.
          </p>
        </motion.div>

        {/* 4 Solution Blocks Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {solutions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={cardRevealVariant}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-level-1 p-6 sm:p-8 rounded-3xl border border-white/[0.08] hover:border-[#38bdf8]/45 hover:shadow-[0_24px_48px_-12px_rgba(5,11,20,0.9),0_0_24px_rgba(56,189,248,0.14)] flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-[#38bdf8] px-2.5 py-1 rounded-md bg-[#38bdf8]/10 border border-[#38bdf8]/20 group-hover:border-[#38bdf8]/40 transition-colors">
                      SOLUTION {item.number}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#050B14]/80 border border-white/[0.06] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5 text-[#38bdf8]" />
                    </div>
                  </div>

                  <div className="text-xs font-display font-semibold uppercase tracking-wider text-[#7bd0ff] mb-1">
                    {item.tagline}
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#bdc8d1] leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Channel Synergy Matrix */}
                  <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2.5">
                    <div className="text-[11px] font-display uppercase tracking-wider text-[#7bd0ff] font-semibold">
                      Integrated Pillars:
                    </div>
                    {item.channels.map((chan, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#050B14]/60 border border-white/[0.04]">
                        <span className="font-display font-semibold text-white flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>{chan.name}</span>
                        </span>
                        <span className="text-[11px] text-[#bdc8d1]/80 font-normal">
                          {chan.role}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Result Note */}
                  <div className="mt-4 p-3 rounded-xl bg-[#38bdf8]/5 border border-[#38bdf8]/20 text-xs text-[#a5c8ff] leading-relaxed">
                    <strong className="text-white">Business Impact:</strong> {item.resultBenefit}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04]">
                  <button
                    onClick={() => onSelectSolution(item.title)}
                    className="w-full btn-acrylic py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 group-hover:border-[#38bdf8]/50 transition-all text-white cursor-pointer"
                  >
                    <span>Discuss This Solution</span>
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
