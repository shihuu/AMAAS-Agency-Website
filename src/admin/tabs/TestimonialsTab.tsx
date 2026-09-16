import React, { useState } from 'react';
import { CMSTestimonial } from '../../types';
import { saveTestimonialToDB, deleteTestimonialFromDB, uploadMediaFile } from '../../lib/cmsData';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  Upload,
  Loader2,
  AlertCircle,
  Quote,
} from 'lucide-react';

interface TestimonialsTabProps {
  testimonials: CMSTestimonial[];
  onRefresh: () => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({ testimonials, onRefresh }) => {
  const [editingItem, setEditingItem] = useState<CMSTestimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<Partial<CMSTestimonial>>({
    client_name: '',
    company: '',
    role: '',
    testimonial: '',
    photo_url: '',
    rating: 5,
    featured: true,
    display_order: 0,
    active: true,
  });

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingItem(null);
    setFormData({
      id: `t-${Date.now()}`,
      client_name: '',
      company: '',
      role: '',
      testimonial: '',
      photo_url: '',
      rating: 5,
      featured: true,
      display_order: testimonials.length + 1,
      active: true,
    });
  };

  const handleStartEdit = (t: CMSTestimonial) => {
    setEditingItem(t);
    setIsCreating(false);
    setFormData({ ...t });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete review from "${name}"?`)) return;
    setSaving(true);
    const res = await deleteTestimonialFromDB(id);
    setSaving(false);
    if (res.success) {
      flashMessage(`Deleted review from "${name}"`);
      onRefresh();
    } else {
      flashMessage(res.error || 'Delete failed', 'error');
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const res = await uploadMediaFile(file, 'testimonials');
    setUploading(false);

    if (res.success && res.url) {
      setFormData((prev) => ({ ...prev, photo_url: res.url }));
      flashMessage('Client photo uploaded');
    } else {
      flashMessage(res.error || 'Photo upload failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name?.trim() || !formData.testimonial?.trim()) {
      flashMessage('Client name and testimonial quote are required', 'error');
      return;
    }

    setSaving(true);
    const res = await saveTestimonialToDB({
      ...formData,
      id: formData.id || `t-${Date.now()}`,
      rating: Number(formData.rating) || 5,
      display_order: Number(formData.display_order) || 0,
      active: formData.active !== false,
    });
    setSaving(false);

    if (res.success) {
      flashMessage(`Saved review from "${formData.client_name}"`);
      setIsCreating(false);
      setEditingItem(null);
      onRefresh();
    } else {
      flashMessage(res.error || 'Failed to save testimonial', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Client Testimonials & Endorsements
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Publish social proof, client reviews, verified satisfaction ratings, and corporate logos.
          </p>
        </div>

        {!isCreating && !editingItem && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
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

      {(isCreating || editingItem) && (
        <div className="p-6 rounded-2xl bg-[#08101d] border border-[#38bdf8]/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              {isCreating ? 'Add Client Testimonial' : `Edit: ${formData.client_name}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingItem(null);
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
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g. Elena Vance"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formData.company || ''}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Vance & Sterling Legal Tech"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Job Role / Title
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Founder & Managing Director"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Rating Stars (1-5)
                </label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Photo URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.photo_url || ''}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://... or upload"
                    className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#38bdf8] border border-white/[0.1] cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Client Testimonial Quote *
              </label>
              <textarea
                rows={4}
                required
                value={formData.testimonial || ''}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                placeholder="AMAAS transformed our enterprise website into an ultra-fast client conversion engine..."
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-xs text-[#94a3b8] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-md"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Save Testimonial</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-[#08101d] border border-white/[0.08] hover:border-[#38bdf8]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-4 h-4 text-[#38bdf8]/50" />
              </div>

              <p className="text-xs text-[#cbd5e1] italic line-clamp-4 mb-4 leading-relaxed">
                "{t.testimonial}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                {t.photo_url ? (
                  <img
                    src={t.photo_url}
                    alt={t.client_name}
                    className="w-9 h-9 rounded-full object-cover border border-white/[0.1]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] font-bold text-xs flex items-center justify-center border border-[#38bdf8]/20">
                    {t.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white">{t.client_name}</div>
                  <div className="text-[11px] text-[#94a3b8]">{t.role || t.company}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => handleStartEdit(t)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(t.id, t.client_name)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
