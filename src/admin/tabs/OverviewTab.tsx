import React from 'react';
import { Inquiry, Project, ServiceItem, PricingPlan, CMSTestimonial, MediaAsset } from '../../types';
import {
  Inbox,
  FolderGit2,
  Cpu,
  CreditCard,
  MessageSquareQuote,
  Image as ImageIcon,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface OverviewTabProps {
  inquiries: Inquiry[];
  projects: Project[];
  services: ServiceItem[];
  pricing: PricingPlan[];
  testimonials: CMSTestimonial[];
  mediaAssets: MediaAsset[];
  onNavigateTab: (tab: string) => void;
  onOpenInquiry: (inquiry: Inquiry) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  inquiries,
  projects,
  services,
  pricing,
  testimonials,
  mediaAssets,
  onNavigateTab,
  onOpenInquiry,
}) => {
  const unreadInquiries = inquiries.filter((i) => !i.read || i.status === 'new');
  const recentInquiries = inquiries.slice(0, 5);

  const stats = [
    {
      label: 'Consultation Inquiries',
      value: inquiries.length,
      subValue: `${unreadInquiries.length} unread`,
      icon: Inbox,
      tab: 'inquiries',
      accent: 'from-[#0ea5e9]/20 to-[#0284c7]/5',
      borderColor: 'border-[#38bdf8]/30',
      textColor: 'text-[#38bdf8]',
    },
    {
      label: 'Live Projects',
      value: projects.length,
      subValue: `${projects.filter((p) => p.featured).length} featured`,
      icon: FolderGit2,
      tab: 'projects',
      accent: 'from-purple-500/20 to-purple-800/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
    },
    {
      label: 'Engineered Services',
      value: services.length,
      subValue: 'Active in catalog',
      icon: Cpu,
      tab: 'services',
      accent: 'from-emerald-500/20 to-emerald-800/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    {
      label: 'Pricing Packages',
      value: pricing.length,
      subValue: 'Tiered structures',
      icon: CreditCard,
      tab: 'pricing',
      accent: 'from-amber-500/20 to-amber-800/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      label: 'Client Testimonials',
      value: testimonials.length,
      subValue: 'Endorsements',
      icon: MessageSquareQuote,
      tab: 'testimonials',
      accent: 'from-rose-500/20 to-rose-800/5',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
    },
    {
      label: 'Storage Media Assets',
      value: mediaAssets.length,
      subValue: 'Images & videos',
      icon: ImageIcon,
      tab: 'media',
      accent: 'from-cyan-500/20 to-cyan-800/5',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0a1526] via-[#07111e] to-[#04080e] border border-[#38bdf8]/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7dd3fc]">Production CMS Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            AMAAS Digital Agency Operations
          </h2>
          <p className="text-sm text-[#94a3b8] mt-1 max-w-xl">
            Real-time control over client inquiries, production case studies, service specifications, pricing matrices, and global brand media.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-medium text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>Preview Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => onNavigateTab(item.tab)}
              className={`p-5 rounded-2xl bg-gradient-to-br ${item.accent} bg-[#08101d] border ${item.borderColor} text-left transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer group flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] ${item.textColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#94a3b8] group-hover:text-white transition-colors">
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold text-white font-display tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-[#94a3b8] mt-1">
                  {item.label}
                </div>
                <div className={`text-[11px] font-mono mt-1 ${item.textColor}`}>
                  {item.subValue}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent Inquiries List */}
      <div className="p-6 rounded-2xl bg-[#08101d]/90 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Inbox className="w-5 h-5 text-[#38bdf8]" />
            <h3 className="text-base font-semibold text-white font-display">
              Latest Consultation Inquiries
            </h3>
            {unreadInquiries.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#7dd3fc] text-[11px] font-mono">
                {unreadInquiries.length} New
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('inquiries')}
            className="text-xs text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({inquiries.length})</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#64748b]">
            <Clock className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
            No inquiries received yet. Submissions through the consultation form will appear here in real time.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {recentInquiries.map((inq) => {
              const isUnread = !inq.read || inq.status === 'new';
              return (
                <div
                  key={inq.id}
                  onClick={() => onOpenInquiry(inq)}
                  className="py-3.5 px-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 sm:mt-0 shrink-0 ${
                        isUnread ? 'bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]' : 'bg-[#475569]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-white">{inq.name}</span>
                        {inq.company && (
                          <span className="text-xs text-[#94a3b8]">({inq.company})</span>
                        )}
                        <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-[#cbd5e1]">
                          {inq.service || 'Consultation'}
                        </span>
                        {inq.budget && (
                          <span className="text-[10px] font-mono text-[#38bdf8]">
                            Budget: {inq.budget}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] truncate max-w-md mt-0.5">
                        {inq.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center text-xs text-[#64748b]">
                    <span className="font-mono text-[11px]">
                      {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                    <span className="text-[#38bdf8] text-xs hover:underline">
                      Open Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
