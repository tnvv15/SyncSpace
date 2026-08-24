import React, { useState } from 'react';
import { Layers, ArrowRight, ExternalLink, Sparkles, FolderPlus, Copy, Check } from 'lucide-react';

interface RoomSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomId: string;
  onSwitchRoom: (roomId: string) => void;
}

const PRESET_ROOMS = [
  { id: 'studio-main', name: '🌾 Main Artisan Studio', desc: 'Default studio workspace for active collaborative ideation' },
  { id: 'print-lab', name: '🎨 Risograph & Print Lab', desc: 'Color experiments, ink formulas, and poster drafts' },
  { id: 'bookbinding', name: '📖 Bookbinding & Zines', desc: 'Book layout, page signatures, and stitching guides' },
  { id: 'typography', name: '✒️ Serif & Woodcut Types', desc: 'Specimen cards, ligature notes, and typesetting' },
];

export const RoomSwitcherModal: React.FC<RoomSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRoomId,
  onSwitchRoom,
}) => {
  const [customRoom, setCustomRoom] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDuplicateTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#FFFDF8] border-2 border-stone-800 rounded-lg p-6 shadow-paper-lift animate-fade-in font-sans">
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-riso-coral" />
            <h3 className="font-mono font-bold text-base uppercase tracking-wider text-stone-900">
              Studio Rooms & Peer Workspaces
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-200 rounded font-mono text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Current Room Info & Multi-Tab Tester */}
        <div className="p-3.5 bg-parchment-100 border border-stone-400 rounded-md mb-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-600">Current Room ID:</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#FEF08A] border border-stone-800 rounded">
              {currentRoomId}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-stone-300">
            <button
              onClick={handleOpenDuplicateTab}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-riso-indigo hover:bg-stone-900 text-white rounded text-xs font-mono font-bold transition-all shadow-paper-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Live Sync (Open New Tab)</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#FFFDF8] hover:bg-stone-100 border border-stone-800 rounded text-xs font-mono font-bold transition-all"
              title="Copy Room Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Preset Rooms */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-mono font-bold text-stone-600 uppercase">
            Switch to Studio Room:
          </label>
          <div className="space-y-1.5">
            {PRESET_ROOMS.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  onSwitchRoom(room.id);
                  onClose();
                }}
                className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between ${
                  currentRoomId === room.id
                    ? 'bg-[#FEF08A]/60 border-stone-800 ring-1 ring-stone-800'
                    : 'bg-stone-50/70 hover:bg-parchment-100 border-stone-300'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-stone-900 font-mono">{room.name}</div>
                  <div className="text-[11px] text-stone-600">{room.desc}</div>
                </div>
                {currentRoomId === room.id ? (
                  <span className="text-[10px] font-mono font-bold text-riso-indigo">ACTIVE</span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Room Input */}
        <div className="pt-2 border-t border-stone-200">
          <label className="block text-xs font-mono font-bold text-stone-600 uppercase mb-1">
            Create / Enter Custom Room:
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customRoom.trim()) {
                onSwitchRoom(customRoom.trim().toLowerCase().replace(/\s+/g, '-'));
                onClose();
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              placeholder="e.g. secret-workshop-2"
              className="flex-1 px-3 py-1.5 bg-parchment-50 border border-stone-400 rounded text-xs font-mono outline-none focus:border-stone-800"
            />
            <button
              type="submit"
              disabled={!customRoom.trim()}
              className="px-4 py-1.5 bg-riso-coral hover:bg-red-700 disabled:opacity-50 text-white rounded text-xs font-mono font-bold transition-all shadow-paper-sm"
            >
              Enter Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
