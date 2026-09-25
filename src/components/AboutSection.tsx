import React from 'react';
import { motion } from 'motion/react';
import { WHY_AMAAS_ITEMS } from '../data';
import { Sparkles, TrendingUp, Smartphone, Cpu, MessageSquare, Rocket, Globe } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

export const AboutSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#38bdf8]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#67e8f9]" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#8ed5ff]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#38bdf8]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#7bd0ff]" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-[#5bdeef]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ABOUT (Concise & Focused) with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-4">
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              About AMAAS
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Digital Growth, Technology & Automation
          </h2>

          <p className="mt-5 text-base sm:text-xl text-[#dce3f0] font-normal leading-relaxed max-w-3xl mx-auto">
            AMAAS is a digital growth and technology agency combining marketing, AI, development and creative strategy to help businesses build, reach and convert.
          </p>

          {/* 4 Pillars Grid */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#050B14]/70 border border-white/[0.08]">
              <div className="text-[11px] font-mono text-[#38bdf8] font-bold uppercase tracking-wider">01 &bull; Technology</div>
              <div className="font-display font-semibold text-white mt-1 text-sm sm:text-base">Full-Stack Engineering</div>
              <p className="text-xs text-[#bdc8d1] mt-1.5 leading-snug">Fast web platforms, robust backend APIs & clean database systems.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050B14]/70 border border-white/[0.08]">
              <div className="text-[11px] font-mono text-[#67e8f9] font-bold uppercase tracking-wider">02 &bull; Marketing</div>
              <div className="font-display font-semibold text-white mt-1 text-sm sm:text-base">Performance Growth</div>
              <p className="text-xs text-[#bdc8d1] mt-1.5 leading-snug">Google Ads, Meta Ads & Technical SEO campaigns that drive buyer intent.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050B14]/70 border border-white/[0.08]">
              <div className="text-[11px] font-mono text-[#8ed5ff] font-bold uppercase tracking-wider">03 &bull; AI</div>
              <div className="font-display font-semibold text-white mt-1 text-sm sm:text-base">Intelligent Automation</div>
              <p className="text-xs text-[#bdc8d1] mt-1.5 leading-snug">24/7 client chatbots, automated lead qualification & operational pipelines.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#050B14]/70 border border-white/[0.08]">
              <div className="text-[11px] font-mono text-[#5bdeef] font-bold uppercase tracking-wider">04 &bull; Creative</div>
              <div className="font-display font-semibold text-white mt-1 text-sm sm:text-base">UI/UX & Brand Design</div>
              <p className="text-xs text-[#bdc8d1] mt-1.5 leading-snug">Conversion-centered interfaces and distinctive digital assets that elevate trust.</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2 text-xs text-[#7bd0ff] font-medium">
            <Globe className="w-4 h-4 text-[#38bdf8]" />
            <span>Serving ambitious businesses worldwide</span>
          </div>
        </motion.div>

        {/* WHY AMAAS? Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center mb-12"
        >
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Why Collaborate With Us?
          </h3>
          <p className="text-xs sm:text-sm text-[#8ed5ff] mt-1">
            Engineered with purpose, delivered with craftsmanship.
          </p>
        </motion.div>

        {/* 6 Reasons Grid with staggered reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {WHY_AMAAS_ITEMS.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardRevealVariant}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-level-1 p-6 rounded-2xl border border-white/[0.08] hover:border-[#38bdf8]/45 hover:shadow-[0_16px_36px_rgba(56,189,248,0.12)] transition-all duration-300 flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#050B14]/80 border border-white/[0.08] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all duration-300 flex items-center justify-center mb-4">
                  {getIcon(item.iconName)}
                </div>

                <h4 className="font-display text-lg font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                  {item.title}
                </h4>

                <p className="mt-2 text-xs sm:text-sm text-[#bdc8d1] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

