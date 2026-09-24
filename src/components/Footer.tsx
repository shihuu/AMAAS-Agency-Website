import React from 'react';
import { AmaasLogo } from './AmaasLogo';
import { ArrowUp, Globe, Mail, MessageCircle, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  // Pure public footer
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'work', label: 'Work' },
    { id: 'ai-solutions', label: 'AI & Automation' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'process', label: 'Process' },
    { id: 'pricing', label: 'Quote' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="relative pt-16 pb-12 border-t border-white/[0.08] bg-[#03070E]/70 backdrop-blur-md overflow-hidden">
      
      {/* Background radial cyan highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#38bdf8]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Brand Center Piece */}
        <div className="flex flex-col items-center text-center pb-12 border-b border-white/[0.08]">
          <AmaasLogo size="lg" />

          <div className="mt-3 text-center">
            <p className="text-[12px] font-display uppercase tracking-[0.25em] text-[#7bd0ff] font-semibold">
              DIGITAL GROWTH & TECHNOLOGY AGENCY
            </p>
            <p className="text-[11px] font-display uppercase tracking-[0.22em] text-[#dce3f0]/80 mt-0.5">
              TECHNOLOGY &bull; MARKETING &bull; AI &bull; CREATIVE DESIGN
            </p>
          </div>

          <p className="mt-4 text-sm text-[#bdc8d1] max-w-lg font-normal leading-relaxed">
            AMAAS combines technology, AI, creative design and performance marketing to help businesses build, reach and convert.
          </p>

          <div className="mt-3 flex items-center justify-center space-x-1.5 text-xs text-[#8ed5ff]">
            <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Serving ambitious brands worldwide</span>
          </div>

          {/* Direct Contact Channels */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:official.amaas.dev@gmail.com"
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-mono text-[#bdc8d1] hover:text-white transition-all flex items-center space-x-2"
              title="Send email to official.amaas.dev@gmail.com"
            >
              <Mail className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>official.amaas.dev@gmail.com</span>
            </a>

            <a
              href="https://wa.me/8801605012812"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-mono text-[#25D366] transition-all flex items-center space-x-2"
              title="Chat on WhatsApp (+8801605012812)"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>+880 1605-012812</span>
            </a>
          </div>

          {/* Navigation Links in Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs sm:text-sm font-medium text-[#bdc8d1] hover:text-[#38bdf8] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Social Links */}
          <div className="mt-6 flex items-center justify-center space-x-6">
            <a
              href="https://www.facebook.com/profile.php?id=61593957066500"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-medium text-[#bdc8d1] hover:text-[#38bdf8] transition-colors flex items-center space-x-1.5 group"
            >
              <Facebook className="w-3.5 h-3.5 text-[#38bdf8]/70 group-hover:text-[#38bdf8] transition-colors" />
              <span>Facebook</span>
            </a>
            <span className="text-white/[0.2]">•</span>
            <a
              href="https://www.instagram.com/official_amaas_dev/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-display font-medium text-[#bdc8d1] hover:text-[#38bdf8] transition-colors flex items-center space-x-1.5 group"
            >
              <Instagram className="w-3.5 h-3.5 text-[#38bdf8]/70 group-hover:text-[#38bdf8] transition-colors" />
              <span>Instagram</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright & Scroll To Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#bdc8d1]/70 gap-4">
          <div className="flex items-center space-x-3">
            <span>© 2026 AMAAS. All rights reserved. Digital Growth & Technology Agency.</span>
            <span className="text-white/[0.2]">•</span>
            <a
              href={`${(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')}/admin`}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  const adminUrl = `${(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')}/admin`;
                  window.history.pushState(null, '', adminUrl);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="text-[#94a3b8] hover:text-[#38bdf8] transition-colors cursor-pointer text-[11px] font-mono"
            >
              Admin Portal
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2 px-3 rounded-full glass-level-1 border border-white/[0.1] text-[#bdc8d1] hover:text-white hover:border-[#38bdf8]/50 transition-all flex items-center space-x-1.5 cursor-pointer"
            aria-label="Back to top"
          >
            <span className="text-[11px] font-display uppercase tracking-wider">Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#38bdf8]" />
          </button>
        </div>

      </div>
    </footer>
  );
};
