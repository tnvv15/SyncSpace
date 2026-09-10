import React from 'react';
import { Sparkles, X, Keyboard } from 'lucide-react';

interface CanvasShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvasShortcutsModal: React.FC<CanvasShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Tools',
      shortcuts: [
        { key: 'V', desc: 'Select / Move Tool' },
        { key: 'H / Space', desc: 'Hand / Pan Tool' },
        { key: 'A', desc: 'Arrow Connector' },
        { key: 'L', desc: 'Straight Line' },
        { key: 'R', desc: 'Rectangle' },
        { key: 'O', desc: 'Circle / Ellipse' },
        { key: 'D', desc: 'Diamond Shape' },
        { key: 'P', desc: 'Pencil / Freehand' },
        { key: 'T', desc: 'Text Block' },
        { key: 'S / N', desc: 'Sticky Note' },
        { key: 'E', desc: 'Eraser Tool' },
      ],
    },
    {
      title: 'Editing & Actions',
      shortcuts: [
        { key: 'Ctrl + Z', desc: 'Undo' },
        { key: 'Ctrl + Shift + Z / Ctrl + Y', desc: 'Redo' },
        { key: 'Ctrl + C', desc: 'Copy selected' },
        { key: 'Ctrl + V', desc: 'Paste clipboard' },
        { key: 'Ctrl + D', desc: 'Duplicate selected' },
        { key: 'Delete / Backspace', desc: 'Delete selected' },
        { key: 'Ctrl + A', desc: 'Select All items' },
        { key: 'Shift + Click', desc: 'Multi-select items' },
        { key: 'Double Click', desc: 'Edit text in shape' },
        { key: 'Esc', desc: 'Deselect / Cancel edit' },
      ],
    },
    {
      title: 'Navigation & Zoom',
      shortcuts: [
        { key: 'Ctrl + Wheel', desc: 'Zoom in / out' },
        { key: 'Wheel Scroll', desc: 'Pan canvas' },
        { key: 'Space + Drag', desc: 'Pan canvas freely' },
        { key: 'Ctrl + 0', desc: 'Reset zoom (100%)' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-workspace-200 shadow-xl max-w-2xl w-full p-6 space-y-5 animate-scale-up select-none max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-workspace-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-workspace-900">Canvas Keyboard Shortcuts</h3>
              <p className="text-xs text-workspace-500">Accelerate your whiteboard workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-workspace-400 hover:text-workspace-700 hover:bg-workspace-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {shortcutGroups.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-xs font-bold text-workspace-400 uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between bg-workspace-50 px-2.5 py-1.5 rounded-lg border border-workspace-100 text-xs"
                  >
                    <span className="text-workspace-700 font-medium">{sc.desc}</span>
                    <kbd className="px-1.5 py-0.5 bg-white border border-workspace-300 rounded font-mono text-[10px] font-bold text-workspace-800 shadow-2xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-workspace-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
