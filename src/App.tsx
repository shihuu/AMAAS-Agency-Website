import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { BusinessSolutionsSection } from './components/BusinessSolutionsSection';
import { WorkSection } from './components/WorkSection';
import { AiSolutionsSection } from './components/AiSolutionsSection';
import { MarketingSection } from './components/MarketingSection';
import { ProcessSection } from './components/ProcessSection';
import { TechnologySection } from './components/TechnologySection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AllProjectsPage } from './components/AllProjectsPage';
import { CaseStudyModal } from './components/CaseStudyModal';
import { ServicePackagesModal } from './components/ServicePackagesModal';
import { ServicesAndPackagesSection } from './components/ServicesAndPackagesSection';
import { PricingPlan, Project, ServiceItem, ServicePackage } from './types';
import { fetchProjectsFromDB, fetchServicesFromDB, fetchPricingFromDB, fetchWebsiteContent } from './lib/cmsData';
import { PROJECTS_DATA, SERVICES_DATA, PRICING_PLANS } from './data';
import { SERVICE_PACKAGES_DATA } from './data/servicePackagesData';
import { AdminApp } from './admin/AdminApp';

const checkIsAdminPath = () => {
  if (typeof window === 'undefined') return false;
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  // 1. Path checking (supports direct domain /admin, /admin/..., and GitHub Pages /<repo-name>/admin)
  const segments = rawPath.split('/').filter(Boolean);
  const hasAdminInPath =
    rawPath === '/admin' ||
    rawPath.startsWith('/admin/') ||
    rawPath.endsWith('/admin') ||
    segments.includes('admin');

  // 2. Hash checking (#admin, #/admin, #/admin/...)
  const cleanHash = hash.replace(/^#\/?/, '');
  const hasAdminInHash =
    cleanHash === 'admin' ||
    cleanHash.startsWith('admin/') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.startsWith('#/admin/');

  // 3. Search query checking (?/admin from SPA fallback or ?admin or ?page=admin)
  const hasAdminInSearch =
    search === '?admin' ||
    search.startsWith('?/admin') ||
    search.startsWith('?admin') ||
    search.includes('page=admin') ||
    search.includes('p=/admin');

  return hasAdminInPath || hasAdminInHash || hasAdminInSearch;
};

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(checkIsAdminPath);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'all-projects'>('home');
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [pricing, setPricing] = useState<PricingPlan[]>(PRICING_PLANS);
  const [websiteContent, setWebsiteContent] = useState<Record<string, string>>({});
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  const [isPackagesModalOpen, setIsPackagesModalOpen] = useState(false);
  const [activePackageService, setActivePackageService] = useState<string | undefined>(undefined);
  const [packageServiceIndex, setPackageServiceIndex] = useState<number>(0);

  const handleOpenPackages = (serviceTitle?: string) => {
    if (serviceTitle) {
      const idx = SERVICE_PACKAGES_DATA.findIndex(
        (s) =>
          s.serviceTitle.toLowerCase() === serviceTitle.toLowerCase() ||
          serviceTitle.toLowerCase().includes(s.serviceTitle.toLowerCase()) ||
          s.serviceTitle.toLowerCase().includes(serviceTitle.toLowerCase())
      );
      if (idx >= 0) {
        setPackageServiceIndex(idx);
      }
    }
    const pkgEl = document.getElementById('packages');
    if (pkgEl) {
      pkgEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePackageService(serviceTitle);
      setIsPackagesModalOpen(true);
    }
  };

  const handleSelectServicePackage = (serviceTitle: string, packageTier: ServicePackage) => {
    setSelectedPlan({
      id: `pkg-${packageTier.level.toLowerCase()}`,
      name: `${serviceTitle} — ${packageTier.name} Package`,
      price: packageTier.priceDisplay,
      bestFor: packageTier.tagline,
      features: packageTier.inclusions,
      buttonText: 'Request a Quote',
    });
    setIsPackagesModalOpen(false);

    setTimeout(() => {
      const formEl = document.getElementById('project-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        scrollToContact();
      }
    }, 150);
  };

  // Listen for navigation changes between public site and /admin
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminRoute(checkIsAdminPath());
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Fetch dynamic CMS data on mount (with automatic fallback to static defaults)
  useEffect(() => {
    fetchProjectsFromDB().then((res) => {
      if (res.fromDb && res.projects && res.projects.length > 0) {
        setProjects(res.projects);
      } else {
        setProjects(PROJECTS_DATA);
      }
    });

    fetchServicesFromDB().then((res) => {
      if (res.services && res.services.length > 0) {
        setServices(res.services);
      }
    });

    fetchPricingFromDB().then((res) => {
      if (res.pricing && res.pricing.length > 0) {
        setPricing(res.pricing);
      }
    });

    fetchWebsiteContent().then((res) => {
      if (res.content && Object.keys(res.content).length > 0) {
        setWebsiteContent(res.content);
      }
    });
  }, []);

  // If visiting /admin, render the secure Admin CMS
  if (isAdminRoute) {
    return <AdminApp />;
  }

  const scrollToContact = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWork = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('work');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById('packages') || document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('packages') || document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    const formEl = document.getElementById('project-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToContact();
    }
  };

  // Compute next/prev project for case study navigation across published projects
  const publishedProjects = projects.filter((p) => p.published !== false);
  const currentCaseStudyIndex = activeCaseStudy
    ? publishedProjects.findIndex((p) => p.id === activeCaseStudy.id)
    : -1;

  const nextProject =
    currentCaseStudyIndex >= 0
      ? publishedProjects[(currentCaseStudyIndex + 1) % publishedProjects.length]
      : undefined;

  const prevProject =
    currentCaseStudyIndex >= 0
      ? publishedProjects[(currentCaseStudyIndex - 1 + publishedProjects.length) % publishedProjects.length]
      : undefined;

  return (
    <div className="min-h-screen bg-transparent text-[#dce3f0] relative selection:bg-[#38bdf8] selection:text-[#00354a]">
      {/* 2. Visual Direction: Core Blue Atmospheric Background */}
      <AtmosphericBackground />

      {/* 4. Navigation (Preserved fixed navbar) */}
      <Navbar
        onStartProject={scrollToContact}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content: Either Dedicated All Projects Page or Full Homepage */}
      <main className="relative z-10">
        {currentView === 'all-projects' ? (
          /* Naturally Scrolling All Projects Page */
          <AllProjectsPage
            projects={projects}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onViewCaseStudy={(proj) => setActiveCaseStudy(proj)}
          />
        ) : (
          /* Standard Homepage */
          <>
            {/* 5. Hero & 7. Trust/Stats Section */}
            <HeroSection
              content={websiteContent}
              onStartProject={scrollToContact}
              onViewWork={scrollToWork}
              onGetQuote={scrollToPricing}
            />

            {/* 8. Services */}
            <ServicesSection
              services={services}
              onStartProject={scrollToContact}
              onOpenPackages={handleOpenPackages}
            />

            {/* Interactive 4-Tier Services & Packages Showcase */}
            <ServicesAndPackagesSection
              selectedServiceIndex={packageServiceIndex}
              onServiceIndexChange={setPackageServiceIndex}
              onSelectPackage={handleSelectServicePackage}
              onCustomQuote={scrollToPricing}
            />

            {/* Business Solutions */}
            <BusinessSolutionsSection
              onSelectSolution={(solutionName) => {
                setSelectedPlan({
                  id: 'solution',
                  name: solutionName,
                  price: 'Custom Scope',
                  bestFor: 'Tailored Business Problem Solving',
                  features: [],
                  buttonText: 'Request a Quote',
                });
                scrollToContact();
              }}
            />

            {/* 9. Selected Work */}
            <WorkSection
              projects={projects}
              onStartProject={scrollToContact}
              onSeeAllProjects={() => {
                setCurrentView('all-projects');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onViewCaseStudy={(proj) => setActiveCaseStudy(proj)}
            />

            {/* AI Solutions & Workflow Automation */}
            <AiSolutionsSection
              onStartAiProject={() => {
                setSelectedPlan({
                  id: 'ai-automation',
                  name: 'AI & Workflow Automation',
                  price: 'Custom Scope',
                  bestFor: 'Intelligent Assistants & Workflow Automation',
                  features: [],
                  buttonText: 'Request a Quote',
                });
                scrollToContact();
              }}
            />

            {/* Performance Marketing & SEO */}
            <MarketingSection
              onStartMarketing={() => {
                setSelectedPlan({
                  id: 'marketing',
                  name: 'Performance Marketing & SEO Strategy',
                  price: 'Custom Scope',
                  bestFor: 'Multi-Channel Acquisition Sprint',
                  features: [],
                  buttonText: 'Request a Quote',
                });
                scrollToContact();
              }}
            />

            {/* 10. Process */}
            <ProcessSection />

            {/* 11. Technology */}
            <TechnologySection />

            {/* 13. Why AMAAS & 14. About */}
            <AboutSection />

            {/* 15. Final CTA & 22. Contact / Project Form */}
            <ContactSection
              preselectedPlan={selectedPlan}
              onClearPreselectedPlan={() => setSelectedPlan(null)}
            />
          </>
        )}
      </main>

      {/* 16. Footer */}
      <Footer />

      {/* Dedicated 4-Tier Service Packages Modal */}
      <AnimatePresence>
        {isPackagesModalOpen && (
          <ServicePackagesModal
            isOpen={isPackagesModalOpen}
            onClose={() => setIsPackagesModalOpen(false)}
            initialServiceTitle={activePackageService}
            onSelectPackage={handleSelectServicePackage}
          />
        )}
      </AnimatePresence>

      {/* Case Study Full Modal */}
      <AnimatePresence>
        {activeCaseStudy && (
          <CaseStudyModal
            project={activeCaseStudy}
            onClose={() => setActiveCaseStudy(null)}
            onNextProject={
              nextProject && publishedProjects.length > 1
                ? () => setActiveCaseStudy(nextProject)
                : undefined
            }
            nextProjectTitle={nextProject ? nextProject.title : undefined}
            onPrevProject={
              prevProject && publishedProjects.length > 1
                ? () => setActiveCaseStudy(prevProject)
                : undefined
            }
            prevProjectTitle={prevProject ? prevProject.title : undefined}
            onStartProject={scrollToContact}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
