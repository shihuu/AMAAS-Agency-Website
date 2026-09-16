import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { modalVariant } from '../lib/motion';
import { normalizeLiveUrl, getWebsiteScreenshotUrls } from '../lib/projectUrl';
import {
  X,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Layers,
  Sparkles,
  Smartphone,
  Cpu,
  Compass,
  Palette,
  Eye,
  Globe,
} from 'lucide-react';

interface CaseStudyModalProps {
  project: Project;
  onClose: () => void;
  onNextProject?: () => void;
  nextProjectTitle?: string;
  onPrevProject?: () => void;
  prevProjectTitle?: string;
  onStartProject: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onNextProject,
  nextProjectTitle,
  onPrevProject,
  prevProjectTitle,
  onStartProject,
}) => {
  // Lock background scroll when open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const { caseStudy } = project;
  const [screenshotTierIndex, setScreenshotTierIndex] = useState(0);
  const [screenshotFailed, setScreenshotFailed] = useState(false);
  const normalizedLiveUrl = normalizeLiveUrl(project.liveUrl);
  const screenshotCandidates = getWebsiteScreenshotUrls(project.liveUrl);
  const screenshotUrl =
    screenshotCandidates.length > 0 && screenshotTierIndex < screenshotCandidates.length
      ? screenshotCandidates[screenshotTierIndex]
      : null;

  const handleScreenshotError = () => {
    if (screenshotTierIndex + 1 < screenshotCandidates.length) {
      setScreenshotTierIndex((prev) => prev + 1);
    } else {
      setScreenshotFailed(true);
    }
  };
  const mediaSrc = project.thumbnail || project.image || '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
    >
      
      {/* Modal Container */}
      <motion.div
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-5xl my-auto max-h-[94vh] overflow-y-auto rounded-3xl bg-[#03070E]/95 border border-[#38bdf8]/35 relative shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(56,189,248,0.15)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Editorial Header Bar */}
        <div className="sticky top-0 z-30 px-6 py-4 bg-[#03070E]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-level-1 text-[#bdc8d1] hover:text-white border border-white/[0.1] hover:border-[#38bdf8]/40 transition-colors cursor-pointer flex items-center space-x-1.5"
              aria-label="Back to portfolio"
            >
              <ArrowLeft className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-xs font-display font-medium pr-1 hidden sm:inline">Back</span>
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#67e8f9] font-medium border border-[#38bdf8]/30">
                {project.category}
              </span>
              <span className="text-white/[0.3]">•</span>
              <span className="text-[#bdc8d1] font-mono">{project.year} Case Study</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {normalizedLiveUrl && (
              <a
                href={normalizedLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 border border-[#38bdf8]/40 text-xs font-semibold text-[#8ed5ff] hover:text-white flex items-center space-x-1.5 transition-all"
              >
                <span>Visit Live Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
              </a>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full glass-level-1 text-[#bdc8d1] hover:text-white border border-white/[0.1] transition-colors cursor-pointer"
              aria-label="Close case study"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-10 space-y-12">
          
          {/* 1. Large Project Hero Section */}
          <div className="border-b border-white/[0.08] pb-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-display uppercase tracking-[0.2em] text-[#67e8f9] font-bold">
                {project.category}
              </span>
              <span className="text-white/[0.2]">•</span>
              <span className="text-xs font-mono text-[#a5c8ff]">{project.year} Production Release</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            {/* Business Type */}
            <div className="mt-3 flex items-center space-x-2 text-sm text-[#8ed5ff] font-medium">
              <Building2 className="w-4 h-4 text-[#38bdf8] shrink-0" />
              <span>{caseStudy.businessType}</span>
            </div>

            {/* Short Project Introduction */}
            <p className="mt-4 text-base sm:text-lg text-[#bdc8d1] font-normal leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>

            {/* 5. Large Website Preview Media: Real Live Embed, Admin Upload, or Safe Fallback */}
            <div className="mt-8 relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#071322] border border-white/[0.12] shadow-2xl group">
              {project.video ? (
                <video
                  src={project.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : screenshotUrl && !screenshotFailed ? (
                <div className="w-full h-full relative overflow-hidden bg-[#050e1a]">
                  <img
                    src={screenshotUrl}
                    alt={`${project.title} live preview`}
                    onError={handleScreenshotError}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-[#0a1e36] to-[#040914]">
                  <Globe className="w-12 h-12 text-[#38bdf8] mb-3" />
                  <span className="text-base font-display font-semibold text-white mb-1">
                    {project.title}
                  </span>
                  <span className="text-xs text-[#bdc8d1] max-w-sm">
                    {project.shortDescription || 'Live website verified.'}
                  </span>
                </div>
              )}

              {/* Direct Live CTA Banner on Media */}
              {normalizedLiveUrl && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto p-3 sm:px-5 sm:py-2.5 rounded-xl bg-[#03070E]/90 backdrop-blur-md border border-white/[0.15] flex items-center space-x-3 shadow-lg z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-white font-medium">Active Production Site:</span>
                  <a
                    href={normalizedLiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#38bdf8] hover:underline flex items-center space-x-1"
                  >
                    <span>{normalizedLiveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 6. Project Overview & 7. Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-widest text-[#7bd0ff] mb-3">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <span>Project Overview</span>
              </div>
              <p className="text-sm text-[#dce3f0] leading-relaxed font-normal">
                {caseStudy.overview}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-widest text-[#f59e0b] mb-3">
                <Compass className="w-4 h-4 text-[#f59e0b]" />
                <span>The Challenge</span>
              </div>
              <p className="text-sm text-[#dce3f0] leading-relaxed font-normal">
                {caseStudy.challenge}
              </p>
            </div>
          </div>

          {/* 8. Strategy / Approach & 9. Design Direction */}
          <div className="space-y-6">
            <h3 className="font-display text-xl font-semibold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#38bdf8]" />
              <span>Strategy, Design & User Experience</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#071322]/60 border border-white/[0.08]">
                <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#67e8f9] mb-2">
                  Design Approach
                </h4>
                <p className="text-xs sm:text-sm text-[#bdc8d1] leading-relaxed">
                  {caseStudy.designApproach}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#071322]/60 border border-white/[0.08]">
                <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#67e8f9] mb-2">
                  UX Strategy
                </h4>
                <p className="text-xs sm:text-sm text-[#bdc8d1] leading-relaxed">
                  {caseStudy.uxStrategy}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#071322]/60 border border-white/[0.08]">
                <div className="flex items-center space-x-1.5 text-xs font-display font-bold uppercase tracking-widest text-[#67e8f9] mb-2">
                  <Palette className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Visual & Interaction</span>
                </div>
                <p className="text-xs sm:text-sm text-[#bdc8d1] leading-relaxed">
                  {caseStudy.visualAndInteraction}
                </p>
              </div>
            </div>
          </div>

          {/* 10. Key Features */}
          <div>
            <h3 className="font-display text-xl font-semibold text-white tracking-tight mb-4">
              Key Features & Architectural Capabilities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {caseStudy.keyFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start space-x-3 text-sm text-[#dce3f0]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 11. Responsive Experience & 12. Development / Technology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-widest text-[#7bd0ff] mb-3">
                <Smartphone className="w-4 h-4 text-[#38bdf8]" />
                <span>Responsive & Mobile Architecture</span>
              </div>
              <p className="text-sm text-[#bdc8d1] leading-relaxed font-normal">
                {caseStudy.responsiveDesign}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-widest text-[#7bd0ff] mb-3">
                <Cpu className="w-4 h-4 text-[#38bdf8]" />
                <span>Development Approach & Stack</span>
              </div>
              <p className="text-sm text-[#bdc8d1] leading-relaxed font-normal mb-4">
                {caseStudy.developmentApproach}
              </p>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-[#a5c8ff]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 13. Visual Showcase / Gallery */}
          {caseStudy.gallery && caseStudy.gallery.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-xs font-display font-bold uppercase tracking-widest text-[#7bd0ff] mb-4">
                <Eye className="w-4 h-4 text-[#38bdf8]" />
                <span>Visual Showcase</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {caseStudy.gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-xl overflow-hidden bg-[#071322] border border-white/[0.08] group/gallery"
                  >
                    <img
                      src={imgUrl}
                      alt={`${project.title} detail ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/gallery:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 14. Final Outcome */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0a2342]/70 to-[#071322]/80 border border-[#38bdf8]/30">
            <h4 className="text-xs font-display font-bold uppercase tracking-widest text-[#67e8f9] mb-2">
              Final Project Outcome
            </h4>
            <p className="text-sm sm:text-base text-white leading-relaxed font-normal">
              {caseStudy.outcome}
            </p>
          </div>

          {/* 15 & 16. Bottom Action Bar: Live Link, Next Project, and Contact CTA */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Live Website Button */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-luminescence w-full md:w-auto px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <span>Visit Live Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Next Project & Inquiry controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
              {onPrevProject && prevProjectTitle && (
                <button
                  onClick={onPrevProject}
                  className="btn-acrylic px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer text-[#bdc8d1] hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>Prev: {prevProjectTitle}</span>
                </button>
              )}

              {onNextProject && nextProjectTitle && (
                <button
                  onClick={onNextProject}
                  className="btn-acrylic px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 cursor-pointer text-[#bdc8d1] hover:text-white"
                >
                  <span>Next: {nextProjectTitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onStartProject();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-white flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <span>Request a Custom Quote</span>
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </motion.div>
  );
};
