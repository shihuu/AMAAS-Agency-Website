import React from 'react';
import { motion } from 'motion/react';
import { SERVICES_DATA } from '../data';
import { ServiceItem } from '../types';
import { Globe, Layout, Layers, Zap, ShieldCheck, ArrowRight, Check, Cpu, Search, Bot, Target, Share2, Megaphone, Palette, Server, Sparkles } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface ServicesSectionProps {
  onStartProject: () => void;
  onOpenPackages?: (serviceTitle?: string) => void;
  services?: ServiceItem[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onStartProject,
  onOpenPackages,
  services = SERVICES_DATA,
}) => {
  const displayServices = services && services.length > 0 ? services : SERVICES_DATA;

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
      case 'Layout':
        return <Layout className="w-5 h-5 text-[#38bdf8]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[#67e8f9]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#8ed5ff]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#5bdeef]" />;
      default:
        return <Globe className="w-5 h-5 text-[#38bdf8]" />;
    }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with scroll entrance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
            <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
              Core Capabilities
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Comprehensive Growth & Technology Services
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            From custom web engineering and practical AI automation to high-performance Google & Meta Ads, each discipline is engineered to help your business build, reach and convert.
          </p>

          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => (onOpenPackages ? onOpenPackages() : onStartProject())}
              className="btn-acrylic px-5 py-2.5 rounded-full text-xs font-semibold text-[#8ed5ff] hover:text-white flex items-center space-x-2 cursor-pointer shadow-sm hover:border-[#38bdf8]/50 transition-all group"
            >
              <Layers className="w-4 h-4 text-[#38bdf8] group-hover:scale-110 transition-transform" />
              <span>Explore 4-Tier Packages for All 9 Services</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* 6 Premium Glass Cards Grid with staggered scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayServices.map((service) => (
            <motion.div
              key={service.number}
              variants={cardRevealVariant}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-level-1 p-6 sm:p-7 rounded-2xl border border-white/[0.08] hover:border-[#38bdf8]/45 hover:shadow-[0_24px_48px_-12px_rgba(5,11,20,0.9),0_0_24px_rgba(56,189,248,0.15)] flex flex-col justify-between group cursor-default"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-xs font-mono font-bold text-[#38bdf8] tracking-widest px-2.5 py-1 rounded-md bg-[#38bdf8]/10 border border-[#38bdf8]/20 group-hover:border-[#38bdf8]/40 transition-colors">
                    {service.number}
                  </span>
                  <div className="p-2.5 rounded-xl bg-[#050B14]/70 border border-white/[0.06] group-hover:border-[#38bdf8]/40 group-hover:scale-105 transition-all duration-300">
                    {getServiceIcon(service.iconName)}
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold text-white group-hover:text-[#8ed5ff] transition-colors">
                  {service.title}
                </h3>

                <p className="mt-2.5 text-sm text-[#bdc8d1] leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-5 space-y-2 pt-4 border-t border-white/[0.06]">
                  {service.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-[#a5c8ff]/90">
                      <Check className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2.5">
                <button
                  onClick={() => (onOpenPackages ? onOpenPackages(service.title) : onStartProject())}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-display font-semibold bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border border-[#38bdf8]/30 hover:border-[#38bdf8]/60 text-[#7bd0ff] hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer group/btn"
                >
                  <Layers className="w-3.5 h-3.5 text-[#38bdf8] group-hover/btn:rotate-12 transition-transform" />
                  <span>View Packages</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#bdc8d1]/75 px-1">
                  <span className="font-mono text-[10px] text-[#38bdf8]/85">Starter • Business • Premium • Custom</span>
                  <button
                    onClick={onStartProject}
                    className="text-[#bdc8d1] hover:text-white hover:underline cursor-pointer"
                  >
                    Custom Inquiry
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
