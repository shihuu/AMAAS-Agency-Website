import React, { useState } from 'react';
import { Project } from '../types';
import { ExternalLink, ArrowRight, BookOpen, Globe } from 'lucide-react';
import { normalizeLiveUrl, getWebsiteScreenshotUrls } from '../lib/projectUrl';

interface ProjectCardProps {
  project: Project;
  onViewCaseStudy: (project: Project) => void;
  featured?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewCaseStudy,
}) => {
  const [videoError, setVideoError] = useState(false);
  const [screenshotTierIndex, setScreenshotTierIndex] = useState(0);
  const [screenshotLoaded, setScreenshotLoaded] = useState(false);
  const [screenshotFailed, setScreenshotFailed] = useState(false);

  // Normalize the live website URL for the "View Live Site" link
  const normalizedLiveUrl = normalizeLiveUrl(project.liveUrl);

  // Tiered screenshot URLs generated dynamically from the live website URL
  const screenshotCandidates = getWebsiteScreenshotUrls(project.liveUrl);
  const currentScreenshotUrl =
    screenshotCandidates.length > 0 && screenshotTierIndex < screenshotCandidates.length
      ? screenshotCandidates[screenshotTierIndex]
      : null;

  const handleScreenshotError = () => {
    if (screenshotTierIndex + 1 < screenshotCandidates.length) {
      setScreenshotLoaded(false);
      setScreenshotTierIndex((prev) => prev + 1);
    } else {
      setScreenshotFailed(true);
    }
  };

  return (
    <div className="group glass-level-1 rounded-3xl p-5 sm:p-6 border border-white/[0.08] hover:border-[#38bdf8]/45 hover:-translate-y-1.5 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between hover:shadow-[0_24px_60px_-12px_rgba(3,7,14,0.95),0_0_28px_rgba(56,189,248,0.15)]">
      <div>
        {/* 1. Media Area: Manually uploaded video, uploaded thumbnail, live website screenshot, or elegant fallback */}
        <div
          onClick={() => onViewCaseStudy(project)}
          className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#071322] border border-white/[0.08] mb-5 cursor-pointer select-none"
        >
          {/* Priority A: Admin-uploaded Real Video */}
          {project.video && !videoError ? (
            <video
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : project.thumbnail ? (
            /* Priority B: Admin manually uploaded real thumbnail */
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          ) : currentScreenshotUrl && !screenshotFailed ? (
            /* Priority C: Real Live Website Homepage Screenshot preview (reliable image service) */
            <div className="w-full h-full relative overflow-hidden bg-[#050e1a]">
              {!screenshotLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#071322] z-10 space-y-2">
                  <div className="w-5 h-5 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[11px] font-mono text-[#8ed5ff]">Loading live preview...</span>
                </div>
              )}
              <img
                src={currentScreenshotUrl}
                alt={`${project.title} live homepage screenshot`}
                onLoad={() => setScreenshotLoaded(true)}
                onError={handleScreenshotError}
                className={`w-full h-full object-cover object-top transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                  screenshotLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              {/* Verified Live Preview Badge */}
              <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 rounded-md bg-[#03070E]/85 backdrop-blur-md border border-white/[0.12] text-[10px] font-mono text-emerald-300 flex items-center space-x-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Site Preview</span>
              </div>
            </div>
          ) : (
            /* Priority D: Clean Fallback when no screenshot and no manual thumbnail */
            <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center bg-gradient-to-b from-[#0a1e36] to-[#040914] border border-white/[0.05]">
              <div className="w-10 h-10 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] mb-2.5">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-xs font-display font-semibold text-white mb-1">
                {project.title}
              </span>
              <span className="text-[11px] text-[#bdc8d1] max-w-xs mb-3 leading-snug">
                {project.shortDescription || 'Live website verified. Open to visit in a new tab.'}
              </span>
              <span className="text-[10px] font-mono text-[#67e8f9] px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
                {project.category}
              </span>
            </div>
          )}

          {/* Category Pill on top of Media */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-full bg-[#03070E]/85 backdrop-blur-md border border-white/[0.12] text-[11px] font-display font-semibold text-[#8ed5ff]">
            {project.category}
          </div>

          {/* Year Pill */}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full bg-[#03070E]/85 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-[#bdc8d1]">
            {project.year}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#03070E]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center backdrop-blur-xs z-30">
            <span className="btn-acrylic px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Explore Case Study</span>
            </span>
          </div>
        </div>

        {/* 2. Category Indicator */}
        <div className="text-[11px] font-display uppercase tracking-[0.16em] text-[#67e8f9] font-bold mb-1.5">
          {project.category}
        </div>

        {/* 3. Project Title */}
        <h3
          onClick={() => onViewCaseStudy(project)}
          className="font-display text-2xl font-semibold text-white group-hover:text-[#8ed5ff] transition-colors duration-200 cursor-pointer mb-2.5"
        >
          {project.title}
        </h3>

        {/* 4. Short Description */}
        <p className="text-sm text-[#bdc8d1] leading-relaxed line-clamp-2 mb-4 font-normal">
          {project.shortDescription}
        </p>

        {/* Tech tags preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md bg-white/[0.04] text-[11px] font-mono text-[#a5c8ff] border border-white/[0.05] hover:border-[#38bdf8]/30 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 5 & 6. Action Buttons: View Case Study + View Live Site */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          onClick={() => onViewCaseStudy(project)}
          className="btn-acrylic px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer hover:border-[#38bdf8]/50 transition-all text-white active:scale-[0.98]"
        >
          <span>View Case Study</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
        </button>

        {normalizedLiveUrl ? (
          <a
            href={normalizedLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border border-[#38bdf8]/30 hover:border-[#38bdf8]/60 text-xs font-semibold text-[#8ed5ff] hover:text-white flex items-center justify-center space-x-1.5 transition-all cursor-pointer group/link active:scale-[0.98]"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8] transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        ) : (
          <span
            className="px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-[#64748b] flex items-center justify-center space-x-1.5 cursor-not-allowed select-none"
            title="Live URL not specified"
          >
            <span>No Live URL</span>
          </span>
        )}
      </div>
    </div>
  );
};
