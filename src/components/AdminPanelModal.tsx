import React, { useState } from 'react';
import { Project, CaseStudyData } from '../types';
import { normalizeLiveUrl } from '../lib/projectUrl';
import {
  getStoredProjects,
  addStoredProject,
  updateStoredProject,
  deleteStoredProject,
  reorderStoredProject,
  resetProjectsToDefault,
} from '../lib/projectsStore';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  RotateCcw,
  Globe,
  Video,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectsUpdated: (updated: Project[]) => void;
}

const DEFAULT_CASE_STUDY: CaseStudyData = {
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

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  projects,
  onProjectsUpdated,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form fields state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    liveUrl: '',
    year: '2026',
    featured: true,
    published: true,
    order: 1,
    technologies: [],
    thumbnail: '',
    video: '',
    caseStudy: DEFAULT_CASE_STUDY,
  });

  const [techInput, setTechInput] = useState('');
  const [keyFeaturesInput, setKeyFeaturesInput] = useState('');

  if (!isOpen) return null;

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setIsCreatingNew(false);
    setFormData({ ...proj });
    setTechInput(proj.technologies.join(', '));
    setKeyFeaturesInput(proj.caseStudy.keyFeatures.join('\n'));
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setEditingProject(null);
    const newOrder = projects.length + 1;
    setFormData({
      id: `project-${Date.now()}`,
      slug: `project-${Date.now()}`,
      title: '',
      category: '',
      shortDescription: '',
      liveUrl: 'https://',
      year: new Date().getFullYear().toString(),
      featured: false,
      published: true,
      order: newOrder,
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      thumbnail: '',
      video: '',
      caseStudy: {
        ...DEFAULT_CASE_STUDY,
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      },
    });
    setTechInput('React, TypeScript, Tailwind CSS');
    setKeyFeaturesInput('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.liveUrl) {
      alert('Please fill in required fields: Title, Category, and Live URL.');
      return;
    }

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const featuresArray = keyFeaturesInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const updatedCaseStudy: CaseStudyData = {
      ...(formData.caseStudy || DEFAULT_CASE_STUDY),
      keyFeatures: featuresArray.length > 0 ? featuresArray : (formData.caseStudy?.keyFeatures || []),
      technologies: techArray,
      businessType: formData.caseStudy?.businessType || `${formData.category} Website`,
      overview: formData.caseStudy?.overview || formData.shortDescription || '',
      challenge: formData.caseStudy?.challenge || 'Balancing modern digital aesthetics with operational efficiency.',
      designApproach: formData.caseStudy?.designApproach || 'Minimal, content-forward editorial architecture.',
      uxStrategy: formData.caseStudy?.uxStrategy || 'Intuitive navigation with frictionless conversion pathways.',
      responsiveDesign: formData.caseStudy?.responsiveDesign || 'Mobile-first layout optimized for all touch targets.',
      visualAndInteraction: formData.caseStudy?.visualAndInteraction || 'Subtle micro-interactions with smooth frame rates.',
      developmentApproach: formData.caseStudy?.developmentApproach || 'Engineered with React, TypeScript, and Tailwind CSS.',
      outcome: formData.caseStudy?.outcome || 'A high-converting, resilient digital flagship platform.',
    };

    const projectPayload: Project = {
      id: formData.id || `proj-${Date.now()}`,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      title: formData.title,
      category: formData.category,
      shortDescription: formData.shortDescription || '',
      liveUrl: normalizeLiveUrl(formData.liveUrl),
      year: formData.year || '2026',
      featured: formData.featured ?? true,
      published: formData.published ?? true,
      order: formData.order ?? projects.length + 1,
      technologies: techArray,
      thumbnail: formData.thumbnail || '',
      video: formData.video || '',
      caseStudy: updatedCaseStudy,
    };

    let updatedList: Project[];
    if (isCreatingNew) {
      updatedList = addStoredProject(projectPayload);
      showStatus(`Created "${projectPayload.title}" successfully.`);
    } else if (editingProject) {
      updatedList = updateStoredProject(editingProject.id, projectPayload);
      showStatus(`Updated "${projectPayload.title}" successfully.`);
    } else {
      return;
    }

    onProjectsUpdated(updatedList);
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = deleteStoredProject(id);
      onProjectsUpdated(updated);
      showStatus(`Deleted "${title}".`);
      if (editingProject?.id === id) {
        setEditingProject(null);
      }
    }
  };

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    const updated = reorderStoredProject(id, direction);
    onProjectsUpdated(updated);
  };

  const handleTogglePublished = (proj: Project) => {
    const updated = updateStoredProject(proj.id, { published: !proj.published });
    onProjectsUpdated(updated);
    showStatus(`"${proj.title}" is now ${!proj.published ? 'Published' : 'Draft'}.`);
  };

  const handleToggleFeatured = (proj: Project) => {
    const updated = updateStoredProject(proj.id, { featured: !proj.featured });
    onProjectsUpdated(updated);
    showStatus(`"${proj.title}" featured status updated.`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all projects back to the default live websites (Atelier Aura, Coffeeian, Forty Nine)?')) {
      const reset = resetProjectsToDefault();
      onProjectsUpdated(reset);
      setEditingProject(null);
      setIsCreatingNew(false);
      showStatus('Reset to default live projects.');
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, thumbnail: base64 }));
      showStatus('Real screenshot uploaded.');
    };
    reader.readAsDataURL(file);
  };

  // Video Upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('Video file size must be under 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, video: base64 }));
      showStatus('Real showcase video uploaded.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      <div
        className="w-full max-w-5xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#03070E] border border-[#38bdf8]/30 relative shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-[#03070E]/95 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse" />
            <div>
              <h2 className="text-base sm:text-lg font-display font-semibold text-white">
                AMAAS Project Manager
              </h2>
              <p className="text-[11px] text-[#bdc8d1]">
                Manage live websites, ordering, and content with persistent local storage.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!editingProject && !isCreatingNew && (
              <button
                onClick={handleStartCreate}
                className="btn-primary-luminescence px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full glass-level-1 text-[#bdc8d1] hover:text-white border border-white/[0.1] hover:border-[#38bdf8]/40 transition-colors cursor-pointer"
              aria-label="Close admin panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="px-6 py-2 bg-[#38bdf8]/15 border-b border-[#38bdf8]/30 text-xs font-mono text-[#8ed5ff] flex items-center space-x-2">
            <Check className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 space-y-6">
          {/* EDIT/CREATE FORM */}
          {editingProject || isCreatingNew ? (
            <form onSubmit={handleSaveForm} className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/[0.08]">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <h3 className="text-sm font-display font-semibold text-white">
                  {isCreatingNew ? 'Create New Project' : `Editing: ${editingProject?.title}`}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingNew(false);
                  }}
                  className="text-xs text-[#bdc8d1] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              {/* Grid Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    placeholder="e.g. Atelier Aura"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    placeholder="e.g. Salon / Beauty & Wellness"
                  />
                </div>

                {/* Live URL */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Live Website URL *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      required
                      value={formData.liveUrl || ''}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8] font-mono"
                      placeholder="https://your-live-site.com"
                    />
                    {normalizeLiveUrl(formData.liveUrl) && (
                      <a
                        href={normalizeLiveUrl(formData.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl glass-level-1 text-[#38bdf8] border border-white/[0.1] hover:border-[#38bdf8]/50"
                        title="Test Live Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    placeholder="Concise overview of the live platform..."
                  />
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8] font-mono"
                    placeholder="React, TypeScript, Tailwind CSS, Vite"
                  />
                </div>

                {/* Year & Order */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#bdc8d1] mb-1">Year</label>
                    <input
                      type="text"
                      value={formData.year || '2026'}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#bdc8d1] mb-1">Order</label>
                    <input
                      type="number"
                      value={formData.order || 1}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>

                {/* Published & Featured Toggles */}
                <div className="flex items-center space-x-6 py-2">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#bdc8d1]">
                    <input
                      type="checkbox"
                      checked={formData.published ?? true}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-white/[0.2] bg-[#071322] text-[#38bdf8] focus:ring-0"
                    />
                    <span>Published</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#bdc8d1]">
                    <input
                      type="checkbox"
                      checked={formData.featured ?? true}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-white/[0.2] bg-[#071322] text-[#38bdf8] focus:ring-0"
                    />
                    <span>Featured on Homepage</span>
                  </label>
                </div>

                {/* Upload Real Screenshot */}
                <div className="p-3 rounded-xl bg-[#071322] border border-white/[0.08]">
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1.5 flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Upload Real Screenshot (Optional)</span>
                  </label>
                  <p className="text-[10px] text-[#8ed5ff] mb-2">
                    Upload an authentic screenshot if iframe preview is restricted.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-[#bdc8d1] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#38bdf8]/20 file:text-[#38bdf8] hover:file:bg-[#38bdf8]/30 cursor-pointer"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[10px] text-emerald-400 font-mono">Custom image uploaded</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, thumbnail: '' })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Real Video */}
                <div className="p-3 rounded-xl bg-[#071322] border border-white/[0.08]">
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1.5 flex items-center space-x-1.5">
                    <Video className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Upload Real Project Video (Optional)</span>
                  </label>
                  <p className="text-[10px] text-[#8ed5ff] mb-2">
                    Showcase an authentic screen recording loop.
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="text-xs text-[#bdc8d1] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#38bdf8]/20 file:text-[#38bdf8] hover:file:bg-[#38bdf8]/30 cursor-pointer"
                  />
                  {formData.video && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-[10px] text-emerald-400 font-mono">Custom video uploaded</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, video: '' })}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Key Features */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[#bdc8d1] mb-1">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={keyFeaturesInput}
                    onChange={(e) => setKeyFeaturesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#071322] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-[#38bdf8] font-mono"
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-[#bdc8d1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-luminescence px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                >
                  {isCreatingNew ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* PROJECT LIST TABLE */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#bdc8d1] px-1">
                <span>Active Projects ({projects.length})</span>
                <button
                  onClick={handleResetDefaults}
                  className="text-[11px] text-[#38bdf8] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to 3 Live Websites</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#38bdf8]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Order Controls */}
                      <div className="flex flex-col space-y-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleReorder(proj.id, 'up')}
                          className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.1] disabled:opacity-30 text-[#bdc8d1]"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === projects.length - 1}
                          onClick={() => handleReorder(proj.id, 'down')}
                          className="p-1 rounded bg-white/[0.04] hover:bg-white/[0.1] disabled:opacity-30 text-[#bdc8d1]"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="w-6 text-center font-mono text-xs text-[#38bdf8]">
                        #{proj.order || idx + 1}
                      </span>

                      {/* Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-semibold text-white font-display">
                            {proj.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-[#8ed5ff] border border-white/[0.06]">
                            {proj.category}
                          </span>
                        </div>
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-[#bdc8d1] hover:text-[#38bdf8] flex items-center space-x-1 mt-0.5"
                        >
                          <span>{proj.liveUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Status badges & Actions */}
                    <div className="flex items-center space-x-2 sm:self-center self-end">
                      {/* Published Toggle */}
                      <button
                        onClick={() => handleTogglePublished(proj)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer border ${
                          proj.published !== false
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/[0.04] text-white/40 border-white/[0.06]'
                        }`}
                        title="Click to toggle publish"
                      >
                        {proj.published !== false ? 'Published' : 'Draft'}
                      </button>

                      {/* Featured Toggle */}
                      <button
                        onClick={() => handleToggleFeatured(proj)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer border ${
                          proj.featured
                            ? 'bg-[#38bdf8]/15 text-[#67e8f9] border-[#38bdf8]/30'
                            : 'bg-white/[0.04] text-white/40 border-white/[0.06]'
                        }`}
                        title="Click to toggle featured on home"
                      >
                        {proj.featured ? 'Featured' : 'Standard'}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(proj)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-[#bdc8d1] hover:text-white border border-white/[0.08] transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white/[0.01] border-t border-white/[0.06] text-center text-[11px] text-[#bdc8d1]">
          <span>All edits are automatically saved to browser persistent storage and updated live on the portfolio.</span>
        </div>
      </div>
    </div>
  );
};
