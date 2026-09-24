import React from 'react';
import { motion } from 'motion/react';
import { PRICING_PLANS, PRICING_ADD_ONS } from '../data';
import { Check, ArrowRight, PlusCircle, HelpCircle, Layers } from 'lucide-react';
import { PricingPlan } from '../types';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
  onCustomQuote: () => void;
  onOpenPackages?: (serviceTitle?: string) => void;
  plans?: PricingPlan[];
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onCustomQuote,
  onOpenPackages,
  plans = PRICING_PLANS,
}) => {
  const displayPlans = plans && plans.length > 0 ? plans : PRICING_PLANS;

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
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
              Custom Quotation
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Custom Solutions. Built Around Your Business.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
            Every business is different. We don't believe in rigid, one-size-fits-all packages. Tell us your goals and we will structure the right solution for your exact requirements.
          </p>

          {onOpenPackages && (
            <div className="mt-6 flex items-center justify-center">
              <button
                onClick={() => onOpenPackages()}
                className="btn-acrylic px-5 py-2.5 rounded-full text-xs font-semibold text-[#8ed5ff] hover:text-white flex items-center space-x-2 cursor-pointer shadow-sm hover:border-[#38bdf8]/50 transition-all group"
              >
                <Layers className="w-4 h-4 text-[#38bdf8] group-hover:scale-110 transition-transform" />
                <span>View Dedicated 4-Tier Packages (All 9 Services)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>

        {/* 4 International Pricing Cards (Responsive 4-column layout) with staggered reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {displayPlans.map((plan) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={plan.id}
                variants={cardRevealVariant}
                whileHover={{ y: isPopular ? -10 : -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  isPopular
                    ? 'glass-level-2 border-2 border-[#38bdf8] shadow-[0_24px_64px_-12px_rgba(56,189,248,0.28)] lg:-translate-y-2 hover:border-[#67e8f9]'
                    : 'glass-level-1 border border-white/[0.08] hover:border-[#38bdf8]/40 hover:shadow-[0_20px_45px_-10px_rgba(5,11,20,0.85)]'
                }`}
              >
                {/* Popular highlight pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#184b82] to-[#38bdf8] text-white text-[10px] font-display font-bold uppercase tracking-widest shadow-md flex items-center justify-center whitespace-nowrap">
                    <span>{plan.popularBadge || 'MOST REQUESTED'}</span>
                  </div>
                )}

                <div>
                  {/* Plan Name & Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-xl font-bold tracking-wide text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-2">
                    <span className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {plan.price.includes('$') ? 'Custom Scope' : plan.price}
                    </span>
                    <span className="text-xs text-[#a5c8ff]/70 ml-2 font-mono">Tailored Quote</span>
                  </div>

                  {/* Best for */}
                  <div className="text-xs font-medium text-[#7bd0ff] mb-4 min-h-[32px] flex items-center">
                    <span>Best for: {plan.bestFor}</span>
                  </div>

                  {/* Price note */}
                  {plan.priceNote && (
                    <div className="text-[11px] text-[#bdc8d1]/75 italic mb-4 leading-snug">
                      {plan.priceNote}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="border-t border-white/[0.08] my-4" />

                  {/* Features list */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-display font-bold uppercase tracking-wider text-[#7bd0ff] mb-2">
                      Scope Inclusions:
                    </div>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-[#dce3f0] leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-[#38bdf8] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div className="mt-8 pt-5 border-t border-white/[0.06]">
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className={`w-full py-3 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                      isPopular
                        ? 'btn-primary-luminescence shadow-lg'
                        : 'btn-acrylic hover:border-[#38bdf8]/50'
                    }`}
                  >
                    <span>Request a Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section 5: Custom Project CTA Bar with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="mt-14 max-w-4xl mx-auto glass-level-2 p-6 sm:p-8 rounded-3xl border border-[#38bdf8]/30 shadow-[0_20px_50px_rgba(5,11,20,0.8)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="font-display text-lg sm:text-xl font-semibold text-white">
              Every business is different. Let's build the right solution.
            </div>
            <div className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
              Have unique integrations, multi-channel marketing requirements, or proprietary AI models? We build tailored quotes aligned with your roadmap.
            </div>
          </div>

          <button
            onClick={onCustomQuote}
            className="btn-primary-luminescence px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-white whitespace-nowrap cursor-pointer shadow-lg shrink-0 flex items-center space-x-2"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Section 7: Optional Add-ons Area with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="mt-16 pt-12 border-t border-white/[0.08]"
        >
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2 text-xs font-display text-[#7bd0ff]">
              <PlusCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Optional Capabilities</span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">
              Additional Services & Add-Ons
            </h3>
            <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
              Modular technical enhancements that can be integrated into any custom build.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {PRICING_ADD_ONS.map((addon, index) => (
              <motion.div
                key={index}
                variants={cardRevealVariant}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="glass-level-1 p-4 rounded-2xl border border-white/[0.06] hover:border-[#38bdf8]/40 hover:shadow-[0_12px_24px_rgba(56,189,248,0.1)] transition-all flex flex-col justify-between cursor-default"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-display text-sm font-semibold text-white">
                      {addon.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded-md shrink-0">
                      {addon.price}
                    </span>
                  </div>
                  {addon.description && (
                    <p className="text-[11px] text-[#bdc8d1]/80 leading-relaxed mt-1">
                      {addon.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Section 6: Quotation Scope Disclaimer */}
        <div className="mt-12 text-center max-w-3xl mx-auto space-y-1.5 text-[11px] text-[#bdc8d1]/65 leading-relaxed">
          <p>
            * All proposals are structured around your business objectives. Detailed technical scopes and milestone deliverables are agreed upon before any project work begins.
          </p>
          <p>
            * Direct advertising spend, domain registrations, premium third-party APIs, and external software subscriptions are managed transparently without hidden markups.
          </p>
        </div>

      </div>
    </section>
  );
};

