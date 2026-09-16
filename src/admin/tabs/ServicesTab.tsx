import React, { useState } from 'react';
import { ServiceItem } from '../../types';
import { saveServiceToDB, deleteServiceFromDB } from '../../lib/cmsData';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Layout,
  Cpu,
  Layers,
  Globe,
  Zap,
  ShieldCheck,
} from 'lucide-react';

interface ServicesTabProps {
  services: ServiceItem[];
  onRefresh: () => void;
}

const COMMON_ICONS = ['Layout', 'Cpu', 'Layers', 'Globe', 'Zap', 'ShieldCheck', 'Smartphone', 'Code2', 'Database', 'Cloud'];

export const ServicesTab: React.FC<ServicesTabProps> = ({ services, onRefresh }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<{
    id?: string;
    number: string;
    title: string;
    description: string;
    iconName: string;
    highlights: string[];
    startingPrice?: string;
    active?: boolean;
    displayOrder?: number;
  }>({
    number: '01',
    title: '',
    description: '',
    iconName: 'Layout',
    highlights: [],
    startingPrice: '',
    active: true,
    displayOrder: 0,
  });

  const [highlightsInput, setHighlightsInput] = useState('');

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingIndex(null);
    const nextNum = String(services.length + 1).padStart(2, '0');
    setFormData({
      id: `service-${Date.now()}`,
      number: nextNum,
      title: '',
      description: '',
      iconName: 'Layout',
      highlights: [],
      startingPrice: '',
      active: true,
      displayOrder: services.length + 1,
    });
    setHighlightsInput('');
  };

  const handleStartEdit = (service: ServiceItem, idx: number) => {
    setEditingIndex(idx);
    setIsCreating(false);
    setFormData({
      id: `service-${idx + 1}`,
      number: service.number,
      title: service.title,
      description: service.description,
      iconName: service.iconName,
      highlights: service.highlights || [],
      active: true,
      displayOrder: idx + 1,
    });
    setHighlightsInput((service.highlights || []).join('\n'));
  };

  const handleDelete = async (title: string, id?: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    setSaving(true);
    const res = await deleteServiceFromDB(id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setSaving(false);
    if (res.success) {
      flashMessage(`Deleted "${title}"`);
      onRefresh();
    } else {
      flashMessage(res.error || 'Delete failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      flashMessage('Service title is required', 'error');
      return;
    }

    const highlightsArray = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const serviceId = formData.id || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    setSaving(true);
    const res = await saveServiceToDB({
      id: serviceId,
      number: formData.number,
      title: formData.title,
      short_description: formData.description,
      full_description: formData.description,
      icon_url: formData.iconName,
      features: highlightsArray,
      starting_price: formData.startingPrice || undefined,
      display_order: formData.displayOrder ?? 0,
      active: formData.active !== false,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);

    if (res.success) {
      flashMessage(`Saved "${formData.title}"`);
      setIsCreating(false);
      setEditingIndex(null);
      onRefresh();
    } else {
      flashMessage(res.error || 'Failed to save service', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Services Architecture CMS
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Manage your service offerings, feature specifications, and technical highlights.
          </p>
        </div>

        {!isCreating && editingIndex === null && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
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

      {(isCreating || editingIndex !== null) && (
        <div className="p-6 rounded-2xl bg-[#08101d] border border-[#38bdf8]/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <h3 className="text-lg font-bold text-white font-display">
              {isCreating ? 'Add Service Offering' : `Edit: ${formData.title}`}
            </h3>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingIndex(null);
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
                  Number Index
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="01"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Frontend Development"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Icon Design
                </label>
                <select
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                >
                  {COMMON_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder ?? 0}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Core technical capabilities..."
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                Highlights & Features (One per line)
              </label>
              <textarea
                rows={4}
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Modern responsive interfaces&#10;Interactive UI & animations&#10;Performance optimization"
                className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingIndex(null);
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
                <span>Save Service</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv, idx) => (
          <div
            key={srv.number || idx}
            className="p-5 rounded-2xl bg-[#08101d] border border-white/[0.08] hover:border-[#38bdf8]/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-[#38bdf8] font-bold">
                  {srv.number}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-[#94a3b8]">
                  {srv.iconName}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-display mb-1.5">
                {srv.title}
              </h3>
              <p className="text-xs text-[#94a3b8] line-clamp-2 mb-3">
                {srv.description}
              </p>
              <ul className="space-y-1">
                {(srv.highlights || []).slice(0, 3).map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] text-[#cbd5e1] flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#38bdf8]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => handleStartEdit(srv, idx)}
                className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(srv.title, `service-${idx + 1}`)}
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
