import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { WorkSection } from './components/WorkSection';
import { ProcessSection } from './components/ProcessSection';
import { TechnologySection } from './components/TechnologySection';
import { PricingSection } from './components/PricingSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AllProjectsPage } from './components/AllProjectsPage';
import { CaseStudyModal } from './components/CaseStudyModal';
import { PricingPlan, Project, ServiceItem } from './types';
import { fetchProjectsFromDB, fetchServicesFromDB, fetchPricingFromDB, fetchWebsiteContent } from './lib/cmsData';
import { PROJECTS_DATA, SERVICES_DATA, PRICING_PLANS } from './data';
import { AdminApp } from './admin/AdminApp';

const checkIsAdminPath = () => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.startsWith('#/admin/')
  );
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
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('pricing');
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
            <ServicesSection services={services} onStartProject={scrollToContact} />

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

            {/* 10. Process */}
            <ProcessSection />

            {/* 11. Technology */}
            <TechnologySection />

            {/* 12. Pricing */}
            <PricingSection
              plans={pricing}
              onSelectPlan={handleSelectPlan}
              onCustomQuote={scrollToContact}
            />

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
