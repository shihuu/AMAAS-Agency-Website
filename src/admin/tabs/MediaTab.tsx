import React, { useState, useEffect } from 'react';
import { MediaAsset } from '../../types';
import { fetchMediaAssets, uploadMediaFile, deleteMediaAsset } from '../../lib/cmsData';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Trash2,
  Filter,
  ExternalLink,
  Loader2,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Media' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'website', label: 'Website UI' },
  { id: 'logos', label: 'Logos' },
  { id: 'videos', label: 'Videos' },
  { id: 'general', label: 'General' },
];

export const MediaTab: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploadCategory, setUploadCategory] = useState('projects');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    const res = await fetchMediaAssets();
    setAssets(res.assets || []);
    setLoading(false);
  };

  const flashMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadMediaFile(file, uploadCategory);
      if (res.success) {
        successCount++;
      } else {
        flashMessage(res.error || 'Upload failed', 'error');
      }
    }

    setUploading(false);
    if (successCount > 0) {
      flashMessage(`Uploaded ${successCount} file(s) to Supabase Storage`);
      loadAssets();
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    flashMessage('Public URL copied to clipboard');
  };

  const handleDelete = async (id: string, filePath: string, name: string) => {
    if (!window.confirm(`Permanently delete "${name}" from Supabase Storage?`)) return;

    const res = await deleteMediaAsset(id, filePath);
    if (res.success) {
      flashMessage(`Deleted "${name}"`);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } else {
      flashMessage(res.error || 'Delete failed', 'error');
    }
  };

  const filteredAssets = selectedCategory === 'all'
    ? assets
    : assets.filter((a) => a.category === selectedCategory);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Supabase Storage & Media Assets
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8] mt-1">
            Upload, store, and link images and video demonstrations directly to public storage bucket: <code className="text-[#38bdf8]">website-assets</code>.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/20 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="p-6 rounded-2xl bg-[#08101d] border-2 border-dashed border-[#38bdf8]/30 hover:border-[#38bdf8]/60 transition-all text-center relative">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center mx-auto border border-[#38bdf8]/20">
            {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>

          <div>
            <h3 className="text-sm font-bold text-white font-display">
              Upload Files to Supabase Storage
            </h3>
            <p className="text-xs text-[#94a3b8] mt-1">
              Supports JPG, PNG, WEBP, SVG, MP4, WEBM (up to 50MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#05090e] border border-white/[0.1] text-xs text-white"
            >
              <option value="projects">Category: Projects</option>
              <option value="services">Category: Services</option>
              <option value="testimonials">Category: Testimonials</option>
              <option value="website">Category: Website UI</option>
              <option value="logos">Category: Logos</option>
              <option value="videos">Category: Videos</option>
              <option value="general">Category: General</option>
            </select>

            <label className="px-4 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-xs font-semibold text-white cursor-pointer shadow-md flex items-center gap-1.5">
              <span>Choose Files</span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#38bdf8] text-[#05090e] font-semibold shadow-md'
                : 'bg-[#08101d] text-[#94a3b8] hover:text-white border border-white/[0.06]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="py-16 text-center text-sm text-[#94a3b8] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#38bdf8]" />
          <span>Loading assets from Supabase...</span>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#08101d] border border-white/[0.08] text-sm text-[#64748b]">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[#475569]" />
          No media uploaded in this category yet. Use the upload box above to add assets.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isVideo = asset.file_type?.startsWith('video') || asset.public_url.endsWith('.mp4');
            return (
              <div
                key={asset.id}
                className="p-3 rounded-2xl bg-[#08101d] border border-white/[0.08] hover:border-[#38bdf8]/40 transition-all flex flex-col justify-between group"
              >
                <div className="aspect-video w-full rounded-xl bg-[#05090e] overflow-hidden border border-white/[0.06] relative flex items-center justify-center">
                  {isVideo ? (
                    <div className="flex flex-col items-center justify-center text-[#38bdf8]">
                      <Video className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-mono">Video File</span>
                    </div>
                  ) : (
                    <img
                      src={asset.public_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-[#cbd5e1] backdrop-blur-xs uppercase">
                    {asset.category || 'media'}
                  </span>
                </div>

                <div className="mt-2.5">
                  <div className="text-xs font-medium text-white truncate" title={asset.name}>
                    {asset.name}
                  </div>
                  <div className="text-[10px] text-[#64748b] font-mono mt-0.5">
                    {formatFileSize(asset.file_size)}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => handleCopyUrl(asset.public_url, asset.id)}
                    title="Copy Public URL"
                    className="p-1 rounded-lg text-[#94a3b8] hover:text-[#38bdf8] hover:bg-white/[0.05] transition-colors flex items-center gap-1 text-[10px]"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.file_path, asset.name)}
                    title="Delete Asset"
                    className="p-1 rounded-lg text-[#94a3b8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
