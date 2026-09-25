import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AmaasLogo } from './AmaasLogo';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onStartProject: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartProject, onNavigateSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'packages', 'solutions', 'work', 'ai-solutions', 'marketing', 'process', 'about', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'packages', label: 'Packages' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'work', label: 'Work' },
    { id: 'ai-solutions', label: 'AI' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'process', label: 'Process' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? 'py-3 bg-[#050B14]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_16px_32px_-8px_rgba(5,11,20,0.95)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo with exact asset */}
        <button
          onClick={() => scrollToSection('home')}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38bdf8] rounded-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center cursor-pointer"
          aria-label="AMAAS Home"
        >
          <AmaasLogo size="sm" />
        </button>

        {/* Desktop Navigation with animated active pill (xl: and above for all 10 links) */}
        <nav className="hidden xl:flex items-center space-x-1 glass-level-1 px-3 py-1.5 rounded-full border border-white/[0.08]">
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white' : 'text-[#bdc8d1] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 shadow-[0_0_14px_rgba(56,189,248,0.3)]"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Primary CTA (Desktop) */}
        <div className="hidden xl:flex items-center space-x-3">
          <PWAInstallButton variant="nav" />
          <button
            onClick={onStartProject}
            className="btn-primary-luminescence inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer group"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Mobile & Tablet Quick Actions / Hamburger */}
        <div className="flex items-center space-x-2.5 xl:hidden">
          <button
            onClick={onStartProject}
            className="btn-primary-luminescence px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-md cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-[#bdc8d1] hover:text-white glass-level-1 border border-white/[0.1] active:scale-95 transition-transform cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile & Tablet Menu Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden glass-level-2 mt-3 mx-3 sm:mx-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#38bdf8]/30 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="flex flex-col">
              {/* Navigation Links: 1 col on mobile, 2 cols on tablet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      activeSection === item.id
                        ? 'bg-[#38bdf8]/20 text-[#8ed5ff] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-[#dce3f0] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
                <PWAInstallButton variant="drawer" />
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartProject();
                  }}
                  className="btn-primary-luminescence w-full py-3.5 rounded-xl text-center font-semibold text-sm flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                >
                  <span>Book Consultation & Start a Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

