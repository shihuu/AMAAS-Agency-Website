import React from 'react';
import { motion } from 'motion/react';
import { PROCESS_STEPS } from '../data';
import { Compass, Target, Code2, Rocket, TrendingUp, Activity } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

export const ProcessSection: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-5 h-5 text-[#38bdf8]" />;
      case 1:
        return <Target className="w-5 h-5 text-[#67e8f9]" />;
      case 2:
        return <Code2 className="w-5 h-5 text-[#8ed5ff]" />;
      case 3:
        return <Rocket className="w-5 h-5 text-[#7bd0ff]" />;
      case 4:
        return <TrendingUp className="w-5 h-5 text-[#38bdf8]" />;
      case 5:
        return <Activity className="w-5 h-5 text-[#5bdeef]" />;
      default:
        return <Compass className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              Development Lifecycle
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Our 6-Phase Engineering Process
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            A structured, transparent workflow ensuring every milestone is tested, validated, and aligned with your business objectives.
          </p>
        </motion.div>

        {/* 6-Step Connected Progression Grid */}
        <div className="relative">
          
          {/* Subtle horizontal connecting line on large desktop */}
          <div className="hidden xl:block absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#38bdf8]/25 to-transparent -translate-y-8 pointer-events-none" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_CONFIG}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
          >
            {PROCESS_STEPS.map((step, idx) => (
              <motion.div
                key={step.number}
                variants={cardRevealVariant}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass-level-1 p-5 rounded-2xl border border-white/[0.08] hover:border-[#38bdf8]/45 transition-all duration-300 relative flex flex-col justify-between group hover:shadow-[0_16px_32px_rgba(56,189,248,0.14)] cursor-default"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#38bdf8] px-2.5 py-1 rounded-md bg-[#38bdf8]/10 border border-[#38bdf8]/20 group-hover:border-[#38bdf8]/40 transition-colors">
                      {step.number}
                    </span>
                    <div className="p-2 rounded-xl bg-[#050B14]/80 border border-white/[0.06] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all duration-300">
                      {getStepIcon(idx)}
                    </div>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#bdc8d1] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-[#a5c8ff]/60 uppercase tracking-wider">
                  Phase 0{idx + 1} of 06
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

