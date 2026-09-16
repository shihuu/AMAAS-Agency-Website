import React, { useState, useEffect } from 'react';
import { Inquiry, Project, ServiceItem, PricingPlan, CMSTestimonial, MediaAsset } from '../types';
import {
  fetchInquiries,
  fetchProjectsFromDB,
  fetchServicesFromDB,
  fetchPricingFromDB,
  fetchTestimonialsFromDB,
  fetchMediaAssets,
} from '../lib/cmsData';
import { getSupabase } from '../lib/supabase';
import { OverviewTab } from './tabs/OverviewTab';
import { InquiriesTab } from './tabs/InquiriesTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { PricingTab } from './tabs/PricingTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { WebsiteContentTab } from './tabs/WebsiteContentTab';
import { MediaTab } from './tabs/MediaTab';
import { SettingsTab } from './tabs/SettingsTab';
import {
  LayoutDashboard,
  Inbox,
  FolderGit2,
  Cpu,
  CreditCard,
  MessageSquareQuote,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  userEmail?: string;
  userId?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  userEmail,
  userId,
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core CMS state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal / drawer selection for inquiry
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const loadAllData = async () => {
    setRefreshing(true);
    const [inqRes, projRes, srvRes, prcRes, tstRes, medRes] = await Promise.all([
      fetchInquiries(),
      fetchProjectsFromDB(),
      fetchServicesFromDB(),
      fetchPricingFromDB(),
      fetchTestimonialsFromDB(),
      fetchMediaAssets(),
    ]);

    setInquiries(inqRes.inquiries);
    setProjects(projRes.projects);
    setProjectsError(projRes.error || null);
    setServices(srvRes.services);
    setPricing(prcRes.pricing);
    setTestimonials(tstRes.testimonials);
    setMediaAssets(medRes.assets);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const unreadInquiriesCount = inquiries.filter((i) => !i.read || i.status === 'new').length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: Inbox,
      badge: unreadInquiriesCount > 0 ? `${unreadInquiriesCount} new` : undefined,
    },
    { id: 'projects', label: 'Projects & Work', icon: FolderGit2, badge: `${projects.length}` },
    { id: 'services', label: 'Services', icon: Cpu, badge: `${services.length}` },
    { id: 'pricing', label: 'Pricing Plans', icon: CreditCard },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { id: 'content', label: 'Website Copy', icon: FileText },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Database & SQL', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#05090e] text-[#f1f5f9] flex flex-col md:flex-row selection:bg-[#38bdf8]/30">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#08101d] border-b border-white/[0.08] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center border border-[#38bdf8]/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-white font-display">AMAAS CMS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#94a3b8] hover:text-white bg-white/[0.05]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-[#070e19] border-r border-white/[0.06] flex flex-col justify-between z-50 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c1929] to-[#071320] border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white font-display tracking-tight">AMAAS CMS</h1>
                <p className="text-[10px] text-[#38bdf8] font-mono">Agency Operations</p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-[#94a3b8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#38bdf8]/15 text-[#38bdf8] font-semibold border border-[#38bdf8]/30 shadow-sm'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#38bdf8]' : 'text-[#64748b]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-[#38bdf8] text-[#05090e] font-bold'
                          : 'bg-white/[0.06] text-[#94a3b8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area & Logout */}
        <div className="p-3 border-t border-white/[0.06] space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs">
            <div className="text-[10px] font-mono text-[#64748b] uppercase">Logged in as</div>
            <div className="text-white font-medium truncate mt-0.5" title={userEmail}>
              {userEmail || 'Admin User'}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={import.meta.env.BASE_URL || '/'}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  const target = import.meta.env.BASE_URL || '/';
                  window.history.pushState(null, '', target);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs text-[#cbd5e1] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3 text-[#38bdf8]" />
            </a>

            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-[#070e19]/60 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#64748b] uppercase tracking-wider">CMS Route</span>
            <span className="text-xs text-white/[0.3]">/</span>
            <span className="text-xs font-mono text-[#38bdf8] capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#cbd5e1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#38bdf8]' : ''}`} />
              <span>Refresh Data</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'dashboard' && (
            <OverviewTab
              inquiries={inquiries}
              projects={projects}
              services={services}
              pricing={pricing}
              testimonials={testimonials}
              mediaAssets={mediaAssets}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenInquiry={(inq) => {
                setSelectedInquiry(inq);
                setActiveTab('inquiries');
              }}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              inquiries={inquiries}
              onRefresh={loadAllData}
              selectedInquiry={selectedInquiry}
              onSelectInquiry={setSelectedInquiry}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsTab projects={projects} projectsError={projectsError} onRefresh={loadAllData} />
          )}

          {activeTab === 'services' && (
            <ServicesTab services={services} onRefresh={loadAllData} />
          )}

          {activeTab === 'pricing' && (
            <PricingTab pricing={pricing} onRefresh={loadAllData} />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialsTab testimonials={testimonials} onRefresh={loadAllData} />
          )}

          {activeTab === 'content' && <WebsiteContentTab />}

          {activeTab === 'media' && <MediaTab />}

          {activeTab === 'settings' && (
            <SettingsTab
              currentUserEmail={userEmail}
              currentUserId={userId}
              onRefreshAll={loadAllData}
            />
          )}
        </div>
      </main>
    </div>
  );
};
