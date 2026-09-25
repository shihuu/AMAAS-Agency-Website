import React from 'react';
import { motion } from 'motion/react';
import { TECHNOLOGIES_CATEGORIES } from '../data';
import { Cpu } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

export const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Glass Container with scroll entrance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="glass-level-2 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 border border-[#38bdf8]/30 relative overflow-hidden shadow-[0_24px_64px_rgba(5,11,20,0.85)]"
        >
          
          {/* Subtle top light catchment */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#67e8f9]/60 to-transparent" />

          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/25 mb-3">
              <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="text-[11px] font-display uppercase tracking-[0.16em] text-[#7bd0ff] font-semibold">
                Engineered For Scale
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Production-Grade Tech Stack & Tooling
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-[#bdc8d1] font-normal leading-relaxed">
              Carefully chosen languages, frameworks, and cloud platforms selected to build fast, secure, and easily maintainable digital applications.
            </p>
          </div>

          {/* Categorized Tech Matrix with staggered cards */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {TECHNOLOGIES_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={idx}
                variants={cardRevealVariant}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 rounded-2xl bg-[#050B14]/70 border border-white/[0.08] hover:border-[#38bdf8]/40 hover:shadow-[0_12px_28px_rgba(56,189,248,0.1)] transition-all flex flex-col justify-between cursor-default"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/[0.06]">
                    <span className="text-xs font-display font-semibold text-[#8ed5ff] uppercase tracking-wider">
                      {cat.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#a5c8ff]/60">
                      {cat.skills.length} tools
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#38bdf8]/50 text-xs font-mono text-[#dce3f0] hover:text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_12px_rgba(56,189,248,0.2)] cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Global verification pill */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs text-[#bdc8d1]/75">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span>Clean, modular, version-controlled architectures</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span>Strict security & API best practices</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              <span>Mobile-first & WCAG accessible standards</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

