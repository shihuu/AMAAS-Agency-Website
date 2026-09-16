import React, { useState } from 'react';
import { Project, CaseStudyData } from '../../types';
import { saveProjectToDB, deleteProjectFromDB, uploadMediaFile, toggleProjectPublishStatus } from '../../lib/cmsData';
import { normalizeLiveUrl } from '../../lib/projectUrl';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Globe,
  Video,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  Star,
  Check,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ProjectsTabProps {
  projects: Project[];
  projectsError?: string | null;
  onRefresh: () => void;
}

const EMPTY_CASE_STUDY: CaseStudyData = {
  overview: '',
  businessType: '',
  challenge: '',
  designApproach: '',
  uxStrategy: '',
  designDirection: '',
  keyFeatures: [],
  responsiveDesign: '',
  visualAndInteraction: '',
  developmentApproach: '',
  technologies: [],
  outcome: '',
  gallery: [],
};

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, projectsError, onRefresh }) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingPublishId, setTogglingPublishId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: 'Full-Stack Web App',
    shortDescription: '',
    liveUrl: '',
    year: '2026',
    featured: false,
    published: true,
    order: 0,
    technologies: [],
    thumbnail: '',
    video: '',
    caseStudy: { ...EMPTY_CASE_STUDY },
  });

  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), type === 'error' ? 6000 : 3500);
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingProject(null);
    const newId = `project-${Date.now()}`;
    setFormData({
      id: newId,
      title: '',
      slug: '',
      category: 'Full-Stack Web App',
      shortDescription: '',
      liveUrl: '',
      year: '2026',
      featured: false,
      published: true,
      order: projects.length + 1,
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      thumbnail: '',
      video: '',
      caseStudy: {
        ...EMPTY_CASE_STUDY,
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      },
    });
    setTechInput('React, TypeScript, Tailwind CSS');
    setFeaturesInput('');
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsCreating(false);
    setFormData({ ...proj });
    setTechInput((proj.technologies || []).join(', '));
    setFeaturesInput((proj.caseStudy?.keyFeatures || []).join('\n'));
  };

  const handleDuplicate = async (proj: Project) => {
    const newId = `project-${Date.now()}`;
    const duplicated: Project = {
      ...proj,
      id: newId,
      title: `${proj.title} (Copy)`,
      order: (proj.order ?? 0) + 1,
      featured: false,
    };
    setSaving(true);
    const res = await saveProjectToDB(duplicated);
    setSaving(false);
    if (res.success) {
      flashMessage(`Project duplicated as "${duplicated.title}"`);
      onRefresh();
    } else {
      flashMessage(res.error || 'Failed to duplicate project', 'error');
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete project "${project.title}"? This cannot be undone.`)) return;

    setDeletingId(project.id);
    const res = await deleteProjectFromDB(project.id);
    setDeletingId(null);

    if (!res.success || !res.deleted) {
      flashMessage(res.error || 'Failed to delete project', 'error');
      return;
    }

    flashMessage(`Deleted "${project.title}"`);
    if (editingProject?.id === project.id) {
      setEditingProject(null);
    }
    onRefresh();
  };

  const handleTogglePublished = async (proj: Project) => {
    const newPublished = !proj.published;
    setTogglingPublishId(proj.id);
    const res = await toggleProjectPublishStatus(proj.id, newPublished);
    setTogglingPublishId(null);

    if (!res.success) {
      flashMessage(res.error || 'Failed to update publication status', 'error');
      return;
    }
    flashMessage(`Project "${proj.title}" is now ${newPublished ? 'Published (visible on website)' : 'Hidden (unpublished)'}`);
    onRefresh();
  };

  const handleToggleFeatured = async (proj: Project) => {
    const updated = { ...proj, featured: !proj.featured };
    const res = await saveProjectToDB(updated);
    if (!res.success) {
      flashMessage(res.error || 'Failed to update featured status', 'error');
      return;
    }
    flashMessage(`Project "${proj.title}" ${updated.featured ? 'featured on homepage' : 'unfeatured'}`);
    onRefresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const res = await uploadMediaFile(file, 'projects');
    setUploadingImage(false);

    if (res.success && res.url) {
      setFormData((prev) => ({
        ...prev,
        [field]: res.url,
      }));
      flashMessage('Media uploaded and linked successfully');
    } else {
      flashMessage(res.error || 'Upload failed', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      flashMessage('Project title is required', 'error');
      return;
    }

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const normalizedUrl = normalizeLiveUrl(formData.liveUrl);

    const projectToSave: Project = {
      id: formData.id || `project-${Date.now()}`,
      title: formData.title || '',
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formData.category || 'Full-Stack Web App',
      shortDescription: formData.shortDescription || '',
      thumbnail: formData.thumbnail || '',
      image: formData.thumbnail || '',
      video: formData.video || '',
      liveUrl: normalizedUrl,
      year: formData.year || '2026',
      featured: Boolean(formData.featured),
      published: formData.published !== false,
      order: Number(formData.order) || 0,
      technologies: techArray,
      caseStudy: {
        ...(formData.caseStudy || EMPTY_CASE_STUDY),
        technologies: techArray,
        keyFeatures: featuresArray,
      },
    };

    setSaving(true);
    const res = await saveProjectToDB(projectToSave);
    setSaving(false);

    if (res.success) {
      flashMessage(`Project "${projectToSave.title}" saved successfully`);
      setIsCreating(false);
      setEditingProject(null);
      onRefresh();
    } else {
      flashMessage(res.error || 'Failed to save project', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Projects & Case Studies CMS
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Publish, edit, reorder, and maintain your live production portfolio items.
          </p>
        </div>

        {!isCreating && !editingProject && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer shadow-lg self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {projectsError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-200">Database Connection / Query Error</div>
            <div className="mt-0.5 text-red-300/90">{projectsError}</div>
          </div>
        </div>
      )}

      {/* Editing / Creating Form Modal / Panel */}
      {(isCreating || editingProject) && (
        <div className="p-6 rounded-2xl bg-[#08101d] border border-[#38bdf8]/30 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#38bdf8]" />
              <h3 className="text-lg font-bold text-white font-display">
                {isCreating ? 'Create New Production Project' : `Edit: ${editingProject?.title}`}
              </h3>
            </div>
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingProject(null);
              }}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: Core Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Zenith Cloud Terminal"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Full-Stack Web App, Enterprise SaaS"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            {/* Links & Display Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Live Website URL
                </label>
                <input
                  type="text"
                  value={formData.liveUrl || ''}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://clientwebsite.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order ?? 0}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div className="flex items-center gap-4 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cbd5e1]">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-white/[0.2] bg-[#05090e] text-[#38bdf8] focus:ring-0"
                  />
                  <span>Featured on Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#cbd5e1]">
                  <input
                    type="checkbox"
                    checked={formData.published !== false}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded border-white/[0.2] bg-[#05090e] text-[#38bdf8] focus:ring-0"
                  />
                  <span>Published Publicly</span>
                </label>
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#05090e] border border-white/[0.06]">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Thumbnail Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://... or upload below"
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#38bdf8] border border-white/[0.1] cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'thumbnail')}
                    />
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-white/[0.1]">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Video Preview URL (Optional MP4 / WEBM)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.video || ''}
                    onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                    placeholder="https://...mp4 or upload"
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#38bdf8]"
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#38bdf8] border border-white/[0.1] cursor-pointer shrink-0 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Description & Tech */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Short Description (Shown on cards)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Concise value proposition and engineering highlights..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#94a3b8] mb-1">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, TypeScript, Supabase, Tailwind CSS, Python"
                  className="w-full px-3 py-2 rounded-xl bg-[#05090e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#38bdf8]"
                />
              </div>
            </div>

            {/* Case Study Details Accordion */}
            <div className="p-4 rounded-xl bg-[#05090e] border border-white/[0.06] space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#38bdf8]">
                Deep-Dive Case Study Fields
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1">Client / Business Type</label>
                  <input
                    type="text"
                    value={formData.caseStudy?.businessType || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caseStudy: { ...(formData.caseStudy || EMPTY_CASE_STUDY), businessType: e.target.value },
                      })
                    }
                    placeholder="e.g. Enterprise Fintech Provider"
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1">The Challenge</label>
                  <input
                    type="text"
                    value={formData.caseStudy?.challenge || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caseStudy: { ...(formData.caseStudy || EMPTY_CASE_STUDY), challenge: e.target.value },
                      })
                    }
                    placeholder="Key problem solved..."
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">
                  Key Features (One feature per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Real-time WebSocket telemetry&#10;Sub-second search indexing&#10;Role-based dashboard permissions"
                  className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1">Design & UX Approach</label>
                  <textarea
                    rows={2}
                    value={formData.caseStudy?.designApproach || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caseStudy: { ...(formData.caseStudy || EMPTY_CASE_STUDY), designApproach: e.target.value },
                      })
                    }
                    placeholder="UX strategy..."
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94a3b8] mb-1">Development & Architecture Outcome</label>
                  <textarea
                    rows={2}
                    value={formData.caseStudy?.outcome || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        caseStudy: { ...(formData.caseStudy || EMPTY_CASE_STUDY), outcome: e.target.value },
                      })
                    }
                    placeholder="Measurable results, conversions, latency metrics..."
                    className="w-full px-3 py-2 rounded-xl bg-[#08101d] border border-white/[0.1] text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-[#94a3b8] hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State when zero projects in database */}
      {!projectsError && projects.length === 0 && !isCreating && !editingProject && (
        <div className="p-12 text-center rounded-2xl bg-[#08101d] border border-white/[0.08] space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-[#64748b]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-display">No projects found in database.</h3>
            <p className="text-xs text-[#94a3b8] mt-1 max-w-md mx-auto">
              The projects database table currently contains zero records. Click &quot;Add New Project&quot; to publish your first production project.
            </p>
          </div>
          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#08101d] border border-white/[0.08] hover:border-[#38bdf8]/30 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              {/* Header row with badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] text-[10px] font-mono border border-[#38bdf8]/20">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono border border-amber-500/20 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      Featured
                    </span>
                  )}
                  {/* Publication status badge - clickable to toggle */}
                  <button
                    type="button"
                    title={proj.published ? 'Click to hide/unpublish from public website' : 'Click to publish on public website'}
                    disabled={togglingPublishId === proj.id}
                    onClick={() => handleTogglePublished(proj)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all cursor-pointer flex items-center gap-1 ${
                      proj.published
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    {togglingPublishId === proj.id ? (
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${proj.published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    )}
                    <span>{proj.published ? 'Published' : 'Hidden'}</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-[#64748b]">
                  Order: {proj.order ?? 0}
                </span>
              </div>

              {/* Title & description */}
              <h3 className="text-base font-bold text-white font-display group-hover:text-[#38bdf8] transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-[#94a3b8] mt-1.5 line-clamp-2">
                {proj.shortDescription}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {(proj.technologies || []).slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-[#cbd5e1]"
                  >
                    {tech}
                  </span>
                ))}
                {(proj.technologies || []).length > 4 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#64748b]">
                    +{proj.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Actions row */}
            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Hide / Unpublish / Publish button */}
                <button
                  type="button"
                  title={proj.published ? 'Hide / Unpublish project from public website' : 'Publish project to public website'}
                  disabled={togglingPublishId === proj.id}
                  onClick={() => handleTogglePublished(proj)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors border cursor-pointer ${
                    proj.published
                      ? 'border-white/[0.1] text-[#94a3b8] hover:text-white hover:bg-white/[0.05]'
                      : 'border-amber-500/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20'
                  }`}
                >
                  {togglingPublishId === proj.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#38bdf8]" />
                  ) : proj.published ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>{proj.published ? 'Hide / Unpublish' : 'Publish'}</span>
                </button>

                <button
                  title={proj.featured ? 'Unfeature' : 'Feature on Homepage'}
                  onClick={() => handleToggleFeatured(proj)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    proj.featured
                      ? 'text-amber-400 hover:bg-amber-500/10'
                      : 'text-[#64748b] hover:bg-white/[0.05]'
                  }`}
                >
                  <Star className={`w-4 h-4 ${proj.featured ? 'fill-amber-400' : ''}`} />
                </button>

                {normalizeLiveUrl(proj.liveUrl) && (
                  <a
                    href={normalizeLiveUrl(proj.liveUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Visit Live URL"
                    className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  title="Duplicate Project"
                  onClick={() => handleDuplicate(proj)}
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#38bdf8] hover:bg-white/[0.05]"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  title="Edit Project"
                  onClick={() => handleStartEdit(proj)}
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.05]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  title="Delete Project"
                  disabled={deletingId === proj.id}
                  onClick={() => handleDelete(proj)}
                  className="p-1.5 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === proj.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};
