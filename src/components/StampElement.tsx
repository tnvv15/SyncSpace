import React, { useState } from 'react';
import { Trash2, Copy, Layers, RotateCw, CheckCircle2, FileEdit, AlertTriangle, Lightbulb, Eye, CheckCheck, Flag, Lock } from 'lucide-react';
import { CanvasElement, StampVariant } from '../types/canvas';
import { STAMP_CONFIG } from '../utils/constants';

interface StampElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onDragStart: (id: string, e: React.PointerEvent) => void;
}

const STAMP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  Lightbulb,
  Eye,
  CheckCheck,
  Flag,
  Lock,
};

export const StampElement: React.FC<StampElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringToFront,
  onDragStart,
}) => {
  const stampType = element.stampType || 'APPROVED';
  const config = STAMP_CONFIG[stampType] || STAMP_CONFIG.APPROVED;
  const [showTypePicker, setShowTypePicker] = useState(false);

  const IconComponent = STAMP_ICONS[config.iconName] || CheckCircle2;

  const cycleRotation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRot = ((element.rotation || 0) + 15) % 360;
    onUpdate(element.id, { rotation: nextRot });
  };

  return (
    <div
      id={`element-${element.id}`}
      className={`absolute select-none group cursor-grab active:cursor-grabbing ${
        isSelected ? 'z-40' : ''
      }`}
      style={{
        transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`,
        zIndex: isSelected ? 900 : element.zIndex || 1,
      }}
      onClick={(e) => onSelect(element.id, e)}
      onPointerDown={(e) => onDragStart(element.id, e)}
    >
      {/* Visual Risograph Rubber Stamp Mark */}
      <div
        className={`relative px-4 py-2 flex items-center gap-2 font-mono uppercase font-black tracking-widest text-sm rounded transition-all select-none animate-stamp-in ${
          config.borderStyle
        } ${isSelected ? 'scale-105 shadow-paper-lg ring-2 ring-riso-indigo' : 'hover:scale-102'}`}
        style={{
          color: config.inkColor,
          borderColor: config.inkColor,
          backgroundColor: `${config.inkColor}0D`,
          textShadow: `1px 1px 0px ${config.inkColor}33`,
        }}
      >
        <IconComponent className="w-5 h-5 shrink-0 animate-pulse-subtle" />
        <span className="leading-none pt-0.5">{config.label}</span>

        {/* Ink Distress Texture Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:3px_3px]" />
      </div>

      {/* Floating Toolbar for Stamp on hover or selection */}
      <div
        className={`absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-parchment-50 border-stamp px-1.5 py-0.5 rounded shadow-paper-md text-stone-700 text-xs ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity z-50`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={cycleRotation}
          title="Rotate Stamp"
          className="p-1 hover:bg-stone-200 rounded"
        >
          <RotateCw className="w-3 h-3" />
        </button>
        <button
          onClick={() => onBringToFront(element.id)}
          title="Bring to Top"
          className="p-1 hover:bg-stone-200 rounded"
        >
          <Layers className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDuplicate(element.id)}
          title="Duplicate Stamp"
          className="p-1 hover:bg-stone-200 rounded"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(element.id)}
          title="Erase Stamp"
          className="p-1 hover:bg-red-500/20 text-red-700 rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
