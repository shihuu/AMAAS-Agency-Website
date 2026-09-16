import React, { useState, useEffect } from 'react';
import { getSupabase } from '../../lib/supabase';
import { saveProjectToDB, saveServiceToDB, savePricingToDB, saveTestimonialToDB, saveWebsiteContent } from '../../lib/cmsData';
import { PROJECTS_DATA, SERVICES_DATA, PRICING_PLANS } from '../../data';
import { DEFAULT_TESTIMONIALS } from '../../lib/cmsData';
import { SUPABASE_SCHEMA_SQL } from '../../lib/schemaSql';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ShieldAlert,
  Server,
  Key,
  Users,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface SettingsTabProps {
  currentUserEmail?: string;
  currentUserId?: string;
  onRefreshAll: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUserEmail,
  currentUserId,
  onRefreshAll,
}) => {
  const [testing, setTesting] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, { ok: boolean; count?: number; error?: string }>>({});
  const [seeding, setSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New admin state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const runDiagnostics = async () => {
    setTesting(true);
    const supabase = getSupabase();
    if (!supabase) {
      setTesting(false);
      return;
    }

    const tables = [
      'inquiries',
      'admin_users',
      'projects',
      'services',
      'pricing_packages',
      'testimonials',
      'website_content',
      'media_assets',
    ];

    const results: Record<string, { ok: boolean; count?: number; error?: string }> = {};

    for (const t of tables) {
      try {
        const { data, error } = await supabase.from(t).select('*', { count: 'exact' }).limit(1);
        if (error) {
          results[t] = { ok: false, error: error.message };
        } else {
          results[t] = { ok: true, count: data?.length || 0 };
        }
      } catch (err) {
        results[t] = { ok: false, error: err instanceof Error ? err.message : 'Unknown' };
      }
    }

    setTableStatus(results);
    setTesting(false);
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Populate Supabase tables with initial portfolio projects, services, and pricing? This will upsert default content.')) {
      return;
    }

    setSeeding(true);
    let successCount = 0;

    try {
      // 1. Seed Projects
      for (const proj of PROJECTS_DATA) {
        const res = await saveProjectToDB(proj);
        if (res.success) successCount++;
      }

      // 2. Seed Services
      for (const s of SERVICES_DATA) {
        const res = await saveServiceToDB({
          id: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          number: s.number,
          title: s.title,
          short_description: s.description,
          full_description: s.description,
          icon_url: s.iconName,
          features: s.highlights,
          active: true,
        });
        if (res.success) successCount++;
      }

      // 3. Seed Pricing
      for (const p of PRICING_PLANS) {
        const res = await savePricingToDB({
          id: p.id,
          name: p.name,
          price: p.price,
          currency: '$',
          description: p.bestFor,
          badge: p.popularBadge,
          featured: Boolean(p.popular),
          cta_text: p.buttonText,
          cta_url: '#contact',
          features: p.features,
          active: true,
        });
        if (res.success) successCount++;
      }

      // 4. Seed Testimonials
      for (const t of DEFAULT_TESTIMONIALS) {
        const res = await saveTestimonialToDB(t);
        if (res.success) successCount++;
      }

      // 5. Seed Website Content
      await saveWebsiteContent('hero', 'headline', 'Full-Stack Web Development for Modern Businesses');
      await saveWebsiteContent('contact', 'phone', '+1 (555) 019-2834');
      await saveWebsiteContent('contact', 'email', 'contact@amaas.com');

      flashMessage(`Successfully seeded ${successCount} records into Supabase!`);
      runDiagnostics();
      onRefreshAll();
    } catch (err) {
      flashMessage(err instanceof Error ? err.message : 'Seeding encountered an error', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleCopySql = () => {
    try {
      navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
      flashMessage('Complete SQL Schema copied! Paste into Supabase SQL Editor.');
    } catch {
      fetch('/supabase_schema.sql')
        .then((res) => res.text())
        .then((text) => {
          navigator.clipboard.writeText(text);
          setCopiedSql(true);
          setTimeout(() => setCopiedSql(false), 2500);
          flashMessage('Complete SQL Schema copied! Paste into Supabase SQL Editor.');
        })
        .catch(() => {
          flashMessage('Please copy from supabase_schema.sql in the project root.', 'error');
        });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setAddingAdmin(true);
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase.from('admin_users').upsert({
        user_id: newAdminUserId || '00000000-0000-0000-0000-000000000000',
        email: newAdminEmail,
        role: 'admin',
      });

      if (error) {
        flashMessage(error.message, 'error');
      } else {
        flashMessage(`Added admin authorization for "${newAdminEmail}"`);
        setNewAdminEmail('');
        setNewAdminUserId('');
      }
    } catch (err) {
      flashMessage(err instanceof Error ? err.message : 'Failed to add admin', 'error');
    } finally {
      setAddingAdmin(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
          CMS System & Database Configuration
        </h2>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
          Monitor Supabase connection health, view SQL schemas, seed production tables, and manage authorized admins.
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

      {/* 1. Database Diagnostics */}
      <div className="p-6 rounded-2xl bg-[#08101d] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
              Supabase PostgreSQL Tables Status
            </h3>
          </div>
          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-[#cbd5e1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>Retest Database</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(
            Object.entries(tableStatus) as [
              string,
              { ok: boolean; count?: number; error?: string }
            ][]
          ).map(([tbl, status]) => (
            <div
              key={tbl}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                status.ok
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
              }`}
            >
              <div>
                <div className="font-mono text-xs font-bold text-white">{tbl}</div>
                <div className="text-[10px] opacity-80 mt-0.5 font-mono">
                  {status.ok ? 'Active in schema' : 'Not yet created'}
                </div>
              </div>
              {status.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Action helper */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer shadow-md transition-all"
          >
            {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Copy Full Supabase SQL Migration</span>
          </button>

          <button
            onClick={handleSeedDefaults}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-2 cursor-pointer transition-all"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#38bdf8]" />}
            <span>Seed Default Content to Supabase</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Accounts */}
      <div className="p-6 rounded-2xl bg-[#08101d] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Users className="w-4 h-4 text-[#38bdf8]" />
          <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Current Authenticated Administrator
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-[#64748b] uppercase">Admin Email</span>
            <div className="font-medium text-white text-sm mt-0.5">{currentUserEmail || 'Active Admin'}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.06]">
            <span className="text-[10px] font-mono text-[#64748b] uppercase">Auth User UUID</span>
            <div className="font-mono text-xs text-[#38bdf8] mt-0.5 truncate">{currentUserId || 'Verified via Supabase'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
