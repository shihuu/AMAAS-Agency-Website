import React, { useState, useMemo, useEffect } from 'react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { X, Globe } from 'lucide-react';

interface AllProjectsModalProps {
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onViewCaseStudy: (project: Project) => void;
}

export const AllProjectsModal: React.FC<AllProjectsModalProps> = ({
  projects,
  isOpen,
  onClose,
  onViewCaseStudy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Prevent background scroll when modal is open, but allow modal to scroll naturally
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Extract unique categories dynamically based on current projects (do NOT show empty categories)
  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.published !== false);
  }, [projects]);

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

  if (!isOpen) return null;

  return (
    /* Full overlay container with natural top-to-bottom scroll and top spacing below fixed navbar */
    <div
      className="fixed inset-0 z-45 overflow-y-auto bg-black/92 backdrop-blur-2xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl mx-auto rounded-3xl bg-[#03070E] border border-[#38bdf8]/30 relative shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(56,189,248,0.15)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 px-6 sm:px-8 py-5 bg-[#03070E]/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between rounded-t-3xl">
          <div>
            <div className="text-[11px] font-display uppercase tracking-[0.2em] text-[#67e8f9] font-bold">
              Project Archive & Live Production Sites
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              All Projects ({publishedProjects.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full glass-level-1 text-[#bdc8d1] hover:text-white border border-white/[0.1] hover:border-[#38bdf8]/40 transition-colors cursor-pointer"
            aria-label="Close all projects"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar & Projects Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Dynamic Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/[0.06]">
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onViewCaseStudy={(p) => onViewCaseStudy(p)}
              />
            ))}
          </div>

          {/* Bottom live note */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs text-[#bdc8d1]">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#38bdf8]" />
              <span>All listed projects are active production deployments accessible worldwide.</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#38bdf8] hover:underline font-semibold cursor-pointer"
            >
              Return to main view
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
