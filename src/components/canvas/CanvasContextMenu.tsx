import React, { useEffect, useRef } from 'react';
import { 
  CanvasElement 
} from '../../types/canvas';
import { 
  Copy, 
  Scissors, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Lock, 
  Unlock, 
  Group, 
  Ungroup, 
  Edit3 
} from 'lucide-react';

interface CanvasContextMenuProps {
  position: { x: number; y: number } | null;
  onClose: () => void;
  selectedElements: CanvasElement[];
  onEdit: () => void;
  onCopy: () => void;
  onCut: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onToggleLock: () => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export const CanvasContextMenu: React.FC<CanvasContextMenuProps> = ({
  position,
  onClose,
  selectedElements,
  onEdit,
  onCopy,
  onCut,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onToggleLock,
  onGroup,
  onUngroup,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('pointerdown', handleOutsideClick);
    return () => window.removeEventListener('pointerdown', handleOutsideClick);
  }, [onClose]);

  if (!position || selectedElements.length === 0) return null;

  const isMulti = selectedElements.length > 1;
  const isGrouped = selectedElements.every((el) => el.groupId && el.groupId === selectedElements[0].groupId);
  const isLocked = selectedElements.every((el) => el.isLocked);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white/95 backdrop-blur-md border border-workspace-200 rounded-xl shadow-dropdown py-1.5 w-52 text-xs text-workspace-700 animate-scale-up select-none"
      style={{
        left: Math.min(position.x, window.innerWidth - 220),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
    >
      {!isMulti && (
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Edit3 className="w-3.5 h-3.5 text-primary-600" />
            <span>Edit Text</span>
          </div>
          <span className="text-[10px] text-workspace-400">Double Click</span>
        </button>
      )}

      <button
        onClick={() => {
          onDuplicate();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Copy className="w-3.5 h-3.5 text-workspace-600" />
          <span>Duplicate</span>
        </div>
        <span className="text-[10px] text-workspace-400">Ctrl+D</span>
      </button>

      <button
        onClick={() => {
          onCopy();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Copy className="w-3.5 h-3.5 text-workspace-600" />
          <span>Copy</span>
        </div>
        <span className="text-[10px] text-workspace-400">Ctrl+C</span>
      </button>

      <button
        onClick={() => {
          onCut();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Scissors className="w-3.5 h-3.5 text-workspace-600" />
          <span>Cut</span>
        </div>
        <span className="text-[10px] text-workspace-400">Ctrl+X</span>
      </button>

      <div className="my-1 border-t border-workspace-100" />

      <button
        onClick={() => {
          onBringToFront();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center space-x-2 transition-colors"
      >
        <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
        <span>Bring to Front</span>
      </button>

      <button
        onClick={() => {
          onSendToBack();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center space-x-2 transition-colors"
      >
        <ArrowDown className="w-3.5 h-3.5 text-workspace-500" />
        <span>Send to Back</span>
      </button>

      {isMulti && (
        <button
          onClick={() => {
            isGrouped ? onUngroup() : onGroup();
            onClose();
          }}
          className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center space-x-2 transition-colors"
        >
          {isGrouped ? (
            <>
              <Ungroup className="w-3.5 h-3.5 text-amber-600" />
              <span>Ungroup Selection</span>
            </>
          ) : (
            <>
              <Group className="w-3.5 h-3.5 text-primary-600" />
              <span>Group Selection</span>
            </>
          )}
        </button>
      )}

      <button
        onClick={() => {
          onToggleLock();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-workspace-100 flex items-center space-x-2 transition-colors"
      >
        {isLocked ? (
          <>
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unlock</span>
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Lock Position</span>
          </>
        )}
      </button>

      <div className="my-1 border-t border-workspace-100" />

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </div>
        <span className="text-[10px] text-rose-400">Del</span>
      </button>
    </div>
  );
};
