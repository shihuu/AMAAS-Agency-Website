import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ProjectCard } from './ProjectCard';
import { CaseStudyModal } from './CaseStudyModal';
import { Grid, ArrowRight } from 'lucide-react';
import { fadeUpVariant, staggerContainer, cardRevealVariant, VIEWPORT_CONFIG } from '../lib/motion';

interface WorkSectionProps {
  projects: Project[];
  onStartProject: () => void;
  onSeeAllProjects: () => void;
  onViewCaseStudy?: (project: Project) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  projects,
  onStartProject,
  onSeeAllProjects,
  onViewCaseStudy,
}) => {
  const [internalActiveProject, setInternalActiveProject] = useState<Project | null>(null);

  // Get published projects
  const publishedProjects = projects.filter((p) => p.published !== false);

  // Featured projects: take projects marked featured, sorted by order; if none marked, take first 3
  const featuredProjects = publishedProjects.filter((p) => p.featured);
  const displayProjects = (featuredProjects.length > 0 ? featuredProjects : publishedProjects)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 3);

  const handleSelectCaseStudy = (proj: Project) => {
    if (onViewCaseStudy) {
      onViewCaseStudy(proj);
    } else {
      setInternalActiveProject(proj);
    }
  };

  // Compute next and previous project indices for case study modal navigation
  const currentIndex = internalActiveProject
    ? publishedProjects.findIndex((p) => p.id === internalActiveProject.id)
    : -1;

  const nextProject =
    currentIndex >= 0
      ? publishedProjects[(currentIndex + 1) % publishedProjects.length]
      : undefined;

  const prevProject =
    currentIndex >= 0
      ? publishedProjects[(currentIndex - 1 + publishedProjects.length) % publishedProjects.length]
      : undefined;

  return (
    <section id="work" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 mb-3">
              <span className="text-xs font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold">
                Capability Showcases
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
              Selected Work
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed">
              Explore live concept and demonstration platforms engineered to showcase our standards in high-performance web development, UI/UX architecture, and responsive execution.
            </p>
          </div>

          {/* Prominent "See All Projects" Header Button */}
          <div className="shrink-0">
            <button
              onClick={onSeeAllProjects}
              className="btn-acrylic px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center space-x-2 cursor-pointer hover:border-[#38bdf8]/50 transition-all text-white group"
            >
              <Grid className="w-4 h-4 text-[#38bdf8]" />
              <span>See All Projects</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[11px] font-mono text-[#8ed5ff]">
                {publishedProjects.length}
              </span>
            </button>
          </div>
        </motion.div>

        {/* 3 Featured Projects Grid with staggered entrance */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayProjects.map((project) => (
            <motion.div key={project.id} variants={cardRevealVariant}>
              <ProjectCard
                project={project}
                onViewCaseStudy={handleSelectCaseStudy}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Prominent Bottom Action & Directory Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
          variants={fadeUpVariant}
          className="mt-12 p-6 sm:p-8 rounded-3xl glass-level-1 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-center sm:text-left">
            <div className="text-xs font-display uppercase tracking-widest text-[#67e8f9] font-bold mb-1">
              Explore Full Archive
            </div>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-white">
              Looking to view all production releases & filter by category?
            </h3>
            <p className="text-xs sm:text-sm text-[#bdc8d1] mt-1">
              Every project in our portfolio is a functional, live digital solution available for public exploration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onSeeAllProjects}
              className="btn-acrylic px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 cursor-pointer hover:border-[#38bdf8]/50 transition-all text-white"
            >
              <Grid className="w-4 h-4 text-[#38bdf8]" />
              <span>See All Projects</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
            </button>

            <button
              onClick={onStartProject}
              className="btn-primary-luminescence px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 cursor-pointer shadow-md"
            >
              <span>Start Your Project</span>
            </button>
          </div>
        </motion.div>

        {/* Fallback Internal Case Study Modal */}
        {internalActiveProject && (
          <CaseStudyModal
            project={internalActiveProject}
            onClose={() => setInternalActiveProject(null)}
            onNextProject={
              nextProject && publishedProjects.length > 1
                ? () => setInternalActiveProject(nextProject)
                : undefined
            }
            nextProjectTitle={nextProject ? nextProject.title : undefined}
            onPrevProject={
              prevProject && publishedProjects.length > 1
                ? () => setInternalActiveProject(prevProject)
                : undefined
            }
            prevProjectTitle={prevProject ? prevProject.title : undefined}
            onStartProject={onStartProject}
          />
        )}

      </div>
    </section>
  );
};

