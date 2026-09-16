import React, { useState } from 'react';
import { PricingPlan, CMSPricingPackage } from '../../types';
import { savePricingToDB, deletePricingFromDB } from '../../lib/cmsData';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

interface PricingTabProps {
  pricing: PricingPlan[];
  onRefresh: () => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({ pricing, onRefresh }) => {
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<Partial<CMSPricingPackage>>({
    name: '',
    price: '$999',
    currency: '$',
    description: '',
    badge: '',
    featured: false,
    cta_text: 'Start Your Project',
    cta_url: '#contact',
    display_order: 0,
    active: true,
  });

  const [featuresInput, setFeaturesInput] = useState('');

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setFormData({
      id: `plan-${Date.now()}`,
      name: '',
      price: '$1,499',
      currency: '$',
      description: 'Ideal for growth companies',
      badge: '',
      featured: false,
      cta_text: 'Choose Plan',
      cta_url: '#contact',
      display_order: pricing.length + 1,
      active: true,
    });
    setFeaturesInput('Responsive Design\nContact System\nDeployment & Hosting Setup');
  };

  const handleStartEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setIsCreating(false);
    setFormData({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: '$',
      description: plan.bestFor,
      badge: plan.popularBadge || '',
      featured: Boolean(plan.popular),
      cta_text: plan.buttonText,
      cta_url: '#contact',
      display_order: 0,
      active: true,
    });
    setFeaturesInput((plan.features || []).join('\n'));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete pricing tier "${name}"?`)) return;
    setSaving(true);
    const res = await deletePricingFromDB(id);
    setSaving(false);
    if (res.success) {
      flashMessage(`Deleted "${name}"`);
      onRefresh();
    } else {
      flashMessage(res.error || 'Delete failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      flashMessage('Plan name is required', 'error');
      return;
    }

    const featuresArray = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const payload: CMSPricingPackage = {
      id: formData.id || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: formData.name,
      price: formData.price || '$999',
      currency: formData.currency || '$',
      description: formData.description || '',
      badge: formData.badge || undefined,
      featured: Boolean(formData.featured),
      cta_text: formData.cta_text || 'Start Your Project',
      cta_url: formData.cta_url || '#contact',
      features: featuresArray,
      display_order: formData.display_order ?? 0,
      active: formData.active !== false,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    const res = await savePricingToDB(payload);
    setSaving(false);

    if (res.success) {
      flashMessage(`Saved "${formData.name}"`);
      setIsCreating(false);
      setEditingPlan(null);
      onRefresh();
    } else {
      flashMessage(res.error || 'Failed to save pricing package', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Pricing Packages CMS
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Update transparent investment tiers, scopes, deliverables, and call-to-actions.
          </p>
        </div>

        {!isCreating && !editingPlan && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pricing Tier</span>
          </button>
        )}
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

      {(isCreating || editingPlan) && (
        <div className="p-6 rounded-2xl bg-[#08101d] border border-[#38bdf8]/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              {isCreating ? 'Create Pricing Tier' : `Edit: ${formData.name}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingPlan(null);
              }}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Business"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Price Display *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="$1,999"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Popular Badge
                </label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. MOST POPULAR"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Best For (Target Audience)
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Small businesses / simple online presence"
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={formData.cta_text || ''}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Build My Business Website"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cbd5e1]">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-white/[0.2] bg-[#05090e] text-[#38bdf8]"
                  />
                  <span>Mark as Most Popular (Highlighted)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Features & Inclusions (One per line)
              </label>
              <textarea
                rows={5}
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="Up to 5 pages&#10;Custom animations&#10;Database integration&#10;SEO setup"
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingPlan(null);
                }}
                className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Package</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pricing.map((plan) => (
          <div
            key={plan.id}
            className={`p-5 rounded-2xl bg-[#08101d] border flex flex-col justify-between transition-all ${
              plan.popular ? 'border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.1)]' : 'border-white/[0.08]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white font-display">
                  {plan.name}
                </span>
                {plan.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] text-[9px] font-mono font-bold">
                    {plan.popularBadge || 'POPULAR'}
                  </span>
                )}
              </div>

              <div className="text-2xl font-bold text-white font-display mb-1">
                {plan.price}
              </div>
              <p className="text-xs text-[#94a3b8] mb-4">
                {plan.bestFor}
              </p>

              <ul className="space-y-1.5 border-t border-white/[0.06] pt-3">
                {(plan.features || []).slice(0, 5).map((feat, fIdx) => (
                  <li key={fIdx} className="text-[11px] text-[#cbd5e1] flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#38bdf8] shrink-0" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
                {(plan.features || []).length > 5 && (
                  <li className="text-[10px] text-[#64748b] font-mono pt-1">
                    +{plan.features.length - 5} more inclusions
                  </li>
                )}
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#64748b] truncate">
                CTA: {plan.buttonText}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(plan)}
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.name)}
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
