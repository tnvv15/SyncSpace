import React from 'react';
import { HelpCircle, Keyboard, Zap, Sparkles, BookOpen } from 'lucide-react';

interface HelpShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpShortcutsModal: React.FC<HelpShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#FFFDF8] border-2 border-stone-800 rounded-lg p-6 shadow-paper-lift animate-fade-in font-sans max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-riso-coral" />
            <h3 className="font-mono font-bold text-base uppercase tracking-wider text-stone-900">
              Studio Craft Handbook & Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-200 rounded font-mono text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Local-First CRDT Summary */}
        <div className="p-3.5 bg-parchment-100 border border-stone-400 rounded-md mb-4 text-xs space-y-2">
          <div className="font-mono font-bold text-stone-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" />
            How Local-First CRDT Works:
          </div>
          <p className="text-stone-700 leading-relaxed">
            Every stroke, card, and edit is stored in your browser's local <strong>IndexedDB</strong> first.
            When an internet connection or peer WebSocket is present, Yjs CRDT mathematically merges concurrent changes conflict-free in real time!
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-800 uppercase tracking-wider">
            <Keyboard className="w-4 h-4 text-riso-sage" />
            Canvas Shortcuts:
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Select Tool:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">V</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Pan Tool / Drag:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">Space / H</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Add Sticky Note:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">N</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Add Index Card:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">T</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Zoom In / Out:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">+ / -</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Reset Zoom (100%):</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">0</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Delete Card:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">Del / Backspace</kbd>
            </div>
            <div className="p-2 bg-stone-50 border border-stone-300 rounded flex justify-between items-center">
              <span className="text-stone-600">Multiplayer Sync:</span>
              <kbd className="px-2 py-0.5 bg-white border border-stone-400 rounded font-bold shadow-xs">Open 2 Tabs</kbd>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 text-white rounded text-xs font-mono font-bold hover:bg-stone-900 transition-all shadow-paper-sm"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
