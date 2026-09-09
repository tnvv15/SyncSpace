import React, { useState } from 'react';
import { X, Image as ImageIcon, Check, Trash2, Link as LinkIcon } from 'lucide-react';

export interface CoverPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverUrl: string;
  onSelectCover: (url: string) => void;
  onRemoveCover: () => void;
}

export const PRESET_COVERS = [
  {
    id: 'abstract-1',
    label: 'Warm Gradient',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'nature-1',
    label: 'Misty Mountains',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'architecture-1',
    label: 'Minimalist Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'ocean-1',
    label: 'Deep Teal Ocean',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'geometry-1',
    label: 'Modern Geometry',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'paper-1',
    label: 'Parchment Texture',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
  },
];

export function CoverPickerModal({
  isOpen,
  onClose,
  currentCoverUrl,
  onSelectCover,
  onRemoveCover,
}: CoverPickerModalProps) {
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onSelectCover(customUrl.trim());
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 animate-fade-in" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-workspace-200 p-6 z-50 font-sans animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-workspace-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
              <ImageIcon size={14} />
            </div>
            <h3 className="text-sm font-bold text-workspace-900">Change Cover</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-workspace-400 hover:text-workspace-700 hover:bg-workspace-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Custom URL Input */}
        <form onSubmit={handleApplyCustomUrl} className="mt-4">
          <label className="block text-xs font-semibold text-workspace-700 mb-1.5">
            Link to an image
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-workspace-400" />
              <input
                type="url"
                placeholder="Paste image URL (https://...)..."
                value={customUrl}
                onChange={e => setCustomUrl(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-workspace-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-workspace-400"
              />
            </div>
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-xs"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Preset Gallery Grid */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-workspace-700 mb-2.5">Gallery</div>
          <div className="grid grid-cols-3 gap-3 max-h-56 overflow-y-auto custom-scrollbar p-0.5">
            {PRESET_COVERS.map(cover => {
              const isSelected = currentCoverUrl === cover.url;
              return (
                <button
                  key={cover.id}
                  type="button"
                  onClick={() => {
                    onSelectCover(cover.url);
                    onClose();
                  }}
                  className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    isSelected ? 'border-primary-600 shadow-sm' : 'border-transparent hover:border-primary-400'
                  }`}
                >
                  <img src={cover.url} alt={cover.label} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 text-[10px] text-white font-medium truncate drop-shadow-xs">
                    {cover.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-xs">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with Remove Cover */}
        <div className="mt-5 pt-3 border-t border-workspace-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onRemoveCover();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Remove cover</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs border border-workspace-200 hover:bg-workspace-50 text-workspace-700 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </>
  );
}

export default CoverPickerModal;
