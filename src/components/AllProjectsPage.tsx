import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { ArrowLeft, Globe, Settings, ArrowUpRight } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface AllProjectsPageProps {
  projects: Project[];
  onBackToHome: () => void;
  onViewCaseStudy: (project: Project) => void;
}

export const AllProjectsPage: React.FC<AllProjectsPageProps> = ({
  projects,
  onBackToHome,
  onViewCaseStudy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Scroll to top when this page mounts so user starts from the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Filter only published projects for the public view (or all if admin has published=true/undefined)
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.published !== false);
  }, [projects]);

  // Extract unique categories dynamically based on current projects (do NOT show empty categories)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    publishedProjects.forEach((p) => {
      if (p.category) {
        cats.add(p.category);
      }
    });
    return ['All', ...Array.from(cats)];
  }, [publishedProjects]);

  // Filter projects by selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return publishedProjects;
    return publishedProjects.filter((p) => p.category === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full min-h-screen pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col"
    >
      
      {/* Top Navigation Row: Back Button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBackToHome}
          className="btn-acrylic px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-2 text-[#bdc8d1] hover:text-white cursor-pointer hover:border-[#38bdf8]/40 transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#38bdf8] transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Homepage</span>
        </button>
      </div>

      {/* Page Header (Starting comfortably below the fixed navbar) */}
      <div className="mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
          <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
            Selected Work & Capability Archive
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
          Selected Projects ({publishedProjects.length})
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed max-w-3xl">
          Explore demonstration web applications and concept platforms engineered with high standards of responsiveness, speed, and modern interface design.
        </p>
      </div>

      {/* Dynamic Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-6 mb-8 border-b border-white/[0.08]">
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? publishedProjects.length
              : publishedProjects.filter((p) => p.category === cat).length;
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-2 active:scale-95 ${
                isActive
                  ? 'bg-[#38bdf8] text-[#03070E] shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                  : 'glass-level-1 text-[#bdc8d1] hover:text-white border border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#03070E]/20 text-[#03070E]' : 'bg-white/[0.06] text-[#8ed5ff]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Responsive Projects Grid */}
      <motion.div
        layout
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        key={selectedCategory}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
      >
        <AnimatePresence>
          {filteredProjects.map((proj) => (
            <motion.div
              layout
              key={proj.id}
              variants={cardRevealVariant}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard
                project={proj}
                onViewCaseStudy={(p) => onViewCaseStudy(p)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Live Production Banner */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_CONFIG}
        variants={fadeUpVariant}
        className="mt-auto p-6 sm:p-8 rounded-3xl glass-level-1 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-white">
              100% Live Worldwide Deployments
            </h4>
            <p className="text-xs text-[#bdc8d1] mt-0.5">
              Every project represents an active, verified production release built with modern web standards.
            </p>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="btn-primary-luminescence px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 cursor-pointer shadow-md"
        >
          <span>Return to Homepage</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>

    </motion.div>
  );
};

