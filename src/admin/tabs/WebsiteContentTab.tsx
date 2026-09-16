import React, { useState, useEffect } from 'react';
import { fetchWebsiteContent, saveWebsiteContent } from '../../lib/cmsData';
import {
  Save,
  Check,
  Globe,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export const WebsiteContentTab: React.FC = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const res = await fetchWebsiteContent();
    setContent(res.content || {});
    setLoading(false);
  };

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const getVal = (section: string, key: string, fallback: string = '') => {
    return content[`${section}.${key}`] !== undefined ? content[`${section}.${key}`] : fallback;
  };

  const setVal = (section: string, key: string, val: string) => {
    setContent((prev) => ({
      ...prev,
      [`${section}.${key}`]: val,
    }));
  };

  const handleSaveSection = async (section: string, keys: string[]) => {
    setSavingSection(section);
    let allOk = true;

    for (const key of keys) {
      const val = content[`${section}.${key}`] || '';
      const res = await saveWebsiteContent(section, key, val);
      if (!res.success) allOk = false;
    }

    setSavingSection(null);
    if (allOk) {
      flashMessage(`Section "${section}" updated successfully`);
    } else {
      flashMessage(`Could not save all fields for "${section}"`, 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#94a3b8] flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#38bdf8]" />
        <span>Loading dynamic site copy...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          Website Copy & Global Brand Content
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Customize headlines, hero messaging, business contact details, and social channels.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* 1. Hero Section */}
      <div className="p-6 rounded-2xl bg-[#08101d] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Hero Section Headline & CTAs
            </h3>
          </div>
          <button
            onClick={() =>
              handleSaveSection('hero', ['badge', 'headline', 'subheadline', 'primary_cta_text', 'secondary_cta_text'])
            }
            disabled={savingSection === 'hero'}
            className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingSection === 'hero' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Hero</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={getVal('hero', 'badge', 'High-Performance Full-Stack Agency')}
              onChange={(e) => setVal('hero', 'badge', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Main Headline
            </label>
            <input
              type="text"
              value={getVal('hero', 'headline', 'Full-Stack Web Development for Modern Businesses')}
              onChange={(e) => setVal('hero', 'headline', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Subheadline / Value Proposition
            </label>
            <textarea
              rows={2}
              value={getVal(
                'hero',
                'subheadline',
                'We design, engineer, and deploy high-converting web applications, bespoke business platforms, and robust database architectures.'
              )}
              onChange={(e) => setVal('hero', 'subheadline', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={getVal('hero', 'primary_cta_text', 'Start Your Project')}
                onChange={(e) => setVal('hero', 'primary_cta_text', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={getVal('hero', 'secondary_cta_text', 'Explore Selected Work')}
                onChange={(e) => setVal('hero', 'secondary_cta_text', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contact Information */}
      <div className="p-6 rounded-2xl bg-[#08101d] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Direct Contact & Channels
            </h3>
          </div>
          <button
            onClick={() => handleSaveSection('contact', ['phone', 'email', 'whatsapp', 'location', 'hours'])}
            disabled={savingSection === 'contact'}
            className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingSection === 'contact' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Contact Info</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Direct Phone Number
            </label>
            <input
              type="text"
              value={getVal('contact', 'phone', '+1 (555) 019-2834')}
              onChange={(e) => setVal('contact', 'phone', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Agency Contact Email
            </label>
            <input
              type="email"
              value={getVal('contact', 'email', 'contact@amaas.com')}
              onChange={(e) => setVal('contact', 'email', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              WhatsApp Direct Number
            </label>
            <input
              type="text"
              value={getVal('contact', 'whatsapp', '+1 (555) 019-2834')}
              onChange={(e) => setVal('contact', 'whatsapp', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Operational Timezone / Location
            </label>
            <input
              type="text"
              value={getVal('contact', 'location', 'Serving Global Clients (EST / GMT / PST)')}
              onChange={(e) => setVal('contact', 'location', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Social Media Links */}
      <div className="p-6 rounded-2xl bg-[#08101d] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Social Profiles & Channels
            </h3>
          </div>
          <button
            onClick={() =>
              handleSaveSection('social', ['facebook', 'instagram', 'linkedin', 'github', 'twitter'])
            }
            disabled={savingSection === 'social'}
            className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-medium text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingSection === 'social' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Social Links</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Facebook URL
            </label>
            <input
              type="text"
              value={getVal('social', 'facebook', 'https://facebook.com/amaasagency')}
              onChange={(e) => setVal('social', 'facebook', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              Instagram URL
            </label>
            <input
              type="text"
              value={getVal('social', 'instagram', 'https://instagram.com/amaasagency')}
              onChange={(e) => setVal('social', 'instagram', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              LinkedIn Profile
            </label>
            <input
              type="text"
              value={getVal('social', 'linkedin', 'https://linkedin.com/company/amaas')}
              onChange={(e) => setVal('social', 'linkedin', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
              GitHub Organization / Repo
            </label>
            <input
              type="text"
              value={getVal('social', 'github', 'https://github.com/amaas')}
              onChange={(e) => setVal('social', 'github', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
