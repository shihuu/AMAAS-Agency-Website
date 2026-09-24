import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, MessageCircle, Mail, Clock, ShieldCheck, Globe, AlertCircle } from 'lucide-react';
import { PricingPlan } from '../types';
import { fadeUpVariant, VIEWPORT_CONFIG } from '../lib/motion';
import { getSupabase } from '../lib/supabase';

interface ContactSectionProps {
  preselectedPlan?: PricingPlan | null;
  onClearPreselectedPlan?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  preselectedPlan,
  onClearPreselectedPlan,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    projectType: 'Website Development',
    budget: preselectedPlan ? `${preselectedPlan.name} (Custom Quote)` : 'Custom Quote / Flexible',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedInfo, setSubmittedInfo] = useState<{ name: string; businessName: string }>({
    name: '',
    businessName: '',
  });

  // Update budget and projectType when preselected plan changes
  useEffect(() => {
    if (preselectedPlan) {
      setFormData((prev) => {
        let matchedService = prev.projectType;
        const nameLower = preselectedPlan.name.toLowerCase();
        if (nameLower.includes('website')) matchedService = 'Website Development';
        else if (nameLower.includes('seo')) matchedService = 'SEO';
        else if (nameLower.includes('chatbot') || nameLower.includes('ai chat')) matchedService = 'AI Chatbot';
        else if (nameLower.includes('automation') || nameLower.includes('ai auto')) matchedService = 'AI Automation';
        else if (nameLower.includes('google ad')) matchedService = 'Google Ads';
        else if (nameLower.includes('meta ad')) matchedService = 'Meta Ads';
        else if (nameLower.includes('social media')) matchedService = 'Social Media Marketing';
        else if (nameLower.includes('ui/ux') || nameLower.includes('design')) matchedService = 'UI/UX & Creative Design';
        else if (nameLower.includes('deploy') || nameLower.includes('technical')) matchedService = 'Deployment & Technical Setup';

        return {
          ...prev,
          projectType: matchedService,
          budget: `${preselectedPlan.name} (Custom Quote)`,
        };
      });
    }
  }, [preselectedPlan]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    // Validate required fields
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
      setErrorMessage('Please fill in all required fields marked with an asterisk (*).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const client = getSupabase();
      if (!client) {
        throw new Error(
          'Database connection not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set.'
        );
      }

      const { error } = await client.from('inquiries').insert([
        {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          company: formData.businessName.trim() || null,
          service: formData.projectType,
          budget: formData.budget,
          message: trimmedMessage,
        },
      ]);

      if (error) {
        throw new Error(error.message || 'Failed to submit your inquiry.');
      }

      // Preserve details for the confirmation screen
      setSubmittedInfo({
        name: trimmedName,
        businessName: formData.businessName.trim(),
      });

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        projectType: 'Full-Stack Development',
        budget: preselectedPlan ? `${preselectedPlan.name} (${preselectedPlan.price})` : 'Business ($1,999)',
        message: '',
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while submitting your brief. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const clientName = submittedInfo.name || formData.name || 'Client';
    const clientBusiness = submittedInfo.businessName || formData.businessName || 'N/A';
    const text = encodeURIComponent(
      `Hi AMAAS, I would like to discuss a project for my business:\n\n• Name: ${clientName}\n• Business: ${clientBusiness}\n• Project Type: ${formData.projectType}\n• Budget Tier: ${formData.budget}\n• Message: ${formData.message || 'Looking forward to reviewing options and timeline!'}`
    );
    window.open(`https://wa.me/8801605012812?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CONTACT / PROJECT INQUIRY FORM with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          id="project-form"
          className="max-w-4xl mx-auto"
        >
          <div className="glass-level-1 rounded-3xl p-6 sm:p-10 border border-white/[0.08] relative">
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-2">
                <span className="text-xs font-display uppercase tracking-widest text-[#67e8f9] font-bold">
                  Direct Project Inquiry
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Book a Consultation & Request a Quote
              </h3>
              <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
                Tell us about your business and what you're trying to achieve. You will receive an initial architectural and strategic response within 24 hours.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="py-12 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8] flex items-center justify-center text-[#38bdf8] mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-white">
                    Project Brief Received
                  </h4>
                  <p className="text-sm text-[#bdc8d1] max-w-md mt-2 leading-relaxed">
                    Thank you, <span className="text-white font-medium">{submittedInfo.name || formData.name || 'Client'}</span>. We have logged your project specifications for <span className="text-[#67e8f9]">{submittedInfo.businessName || formData.businessName || 'your business'}</span>. We will review your scope and get back to you with next steps.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setErrorMessage(null);
                      }}
                      className="btn-acrylic px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                    >
                      Submit Another Brief
                    </button>

                    <button
                      onClick={handleWhatsAppRedirect}
                      className="px-6 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant WhatsApp Follow-up</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  
                  {preselectedPlan && (
                    <div className="p-3.5 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-between text-xs text-[#8ed5ff]">
                      <span>Selected Solution: <strong>{preselectedPlan.name}</strong></span>
                      {onClearPreselectedPlan && (
                        <button
                          type="button"
                          onClick={onClearPreselectedPlan}
                          className="text-[11px] underline hover:text-white cursor-pointer"
                        >
                          Change selection
                        </button>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Your Name / Company Contact *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alexander Wright"
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/80 border border-white/[0.1] text-sm text-white placeholder-[#a5c8ff]/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/80 border border-white/[0.1] text-sm text-white placeholder-[#a5c8ff]/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>

                    {/* Phone / WhatsApp */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Phone / WhatsApp (with country code) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 019-2834 or +44 ..."
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/80 border border-white/[0.1] text-sm text-white placeholder-[#a5c8ff]/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Business or Organization Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Apex Holdings LLC"
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/80 border border-white/[0.1] text-sm text-white placeholder-[#a5c8ff]/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Service Needed */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Service Needed
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/90 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#38bdf8] transition-colors cursor-pointer"
                      >
                        <option value="Website Development">Website Development</option>
                        <option value="SEO">SEO</option>
                        <option value="AI Chatbot">AI Chatbot</option>
                        <option value="AI Automation">AI Automation</option>
                        <option value="Google Ads">Google Ads</option>
                        <option value="Meta Ads">Meta Ads</option>
                        <option value="Social Media Marketing">Social Media Marketing</option>
                        <option value="UI/UX & Creative Design">UI/UX & Creative Design</option>
                        <option value="Deployment & Technical Setup">Deployment & Technical Setup</option>
                        <option value="Comprehensive Agency Solution">Comprehensive Agency Solution</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Budget Range / Package Tier */}
                    <div>
                      <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                        Budget Range / Package Tier
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-[#050B14]/90 border border-white/[0.1] text-sm text-white focus:outline-none focus:border-[#38bdf8] transition-colors cursor-pointer"
                      >
                        {formData.budget && !['Flexible / To Be Discussed', 'Starter Package Tier (Custom Quote)', 'Business Package Tier (Custom Quote)', 'Premium Package Tier (Custom Quote)', 'Custom Package Tier (Tailored)', 'Enterprise / Multi-Service Partnership'].includes(formData.budget) && (
                          <option value={formData.budget}>{formData.budget}</option>
                        )}
                        <option value="Flexible / To Be Discussed">Flexible / To Be Discussed</option>
                        <option value="Starter Package Tier (Custom Quote)">Starter Package Tier (Custom Quote)</option>
                        <option value="Business Package Tier (Custom Quote)">Business Package Tier (Custom Quote)</option>
                        <option value="Premium Package Tier (Custom Quote)">Premium Package Tier (Custom Quote)</option>
                        <option value="Custom Package Tier (Tailored)">Custom Package Tier (Tailored)</option>
                        <option value="Enterprise / Multi-Service Partnership">Enterprise / Multi-Service Partnership</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-display font-medium text-[#bdc8d1] mb-1.5">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your business, the current challenges, target audience, and key features needed..."
                      className="w-full px-4 py-3 rounded-xl bg-[#050B14]/80 border border-white/[0.1] text-sm text-white placeholder-[#a5c8ff]/30 focus:outline-none focus:border-[#38bdf8] transition-colors"
                    />
                  </div>

                  {/* Error Notification */}
                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start space-x-3 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold block mb-0.5">Submission Error</span>
                        <span>{errorMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setErrorMessage(null)}
                        className="text-red-400/60 hover:text-red-300 text-xs cursor-pointer ml-2"
                        aria-label="Dismiss error"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Submit Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-luminescence w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span>Processing Brief...</span>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppRedirect}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Quick Chat on WhatsApp</span>
                    </button>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>

            {/* Response Time Guarantee note */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs text-[#bdc8d1]/70">
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Working with clients across US, UK, EU, CA, AU & UAE</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>NDA & Client Confidentiality Respected</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

