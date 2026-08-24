import React, { useState } from 'react';
import { Trash2, Copy, Layers, Image as ImageIcon } from 'lucide-react';
import { CanvasElement, ShapeVariant } from '../types/canvas';
import { PAPER_COLOR_CONFIG } from '../utils/constants';

interface PaperShapeProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onDragStart: (id: string, e: React.PointerEvent) => void;
}

export const PaperShape: React.FC<PaperShapeProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringToFront,
  onDragStart,
}) => {
  const shapeType = element.shapeType || 'rectangle';
  const colorConfig = PAPER_COLOR_CONFIG[element.color] || PAPER_COLOR_CONFIG.kraft;
  const [caption, setCaption] = useState(element.text || '');

  const renderShapeBody = () => {
    switch (shapeType) {
      case 'polaroid':
        return (
          <div className="w-48 bg-[#FFFDF8] p-3 pb-6 border border-stone-300 shadow-paper-md flex flex-col items-center gap-2">
            <div className="w-full h-36 bg-parchment-300 border border-stone-400/40 flex flex-col items-center justify-center text-stone-500">
              <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
              <span className="text-[10px] font-mono opacity-60">Studio Snapshot</span>
            </div>
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(element.id, { text: e.target.value });
              }}
              placeholder="Handwritten caption..."
              className="w-full text-center font-handwriting text-base font-bold text-stone-700 bg-transparent outline-none placeholder:text-stone-400"
            />
          </div>
        );

      case 'circle':
        return (
          <div
            className={`w-32 h-32 rounded-full border-2 border-dashed flex flex-col items-center justify-center p-3 text-center ${colorConfig.bgClass} ${colorConfig.borderClass} shadow-paper-md`}
          >
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(element.id, { text: e.target.value });
              }}
              placeholder="Badge Text"
              className="w-full text-center font-sans font-black text-xs uppercase tracking-wider bg-transparent outline-none"
            />
          </div>
        );

      case 'banner':
        return (
          <div
            className={`px-6 py-2.5 rounded-sm border-2 ${colorConfig.bgClass} ${colorConfig.borderClass} shadow-paper-md flex items-center justify-center min-w-[220px]`}
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)',
            }}
          >
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(element.id, { text: e.target.value });
              }}
              placeholder="SECTION BANNER"
              className="text-center font-sans font-black text-sm uppercase tracking-widest bg-transparent outline-none"
            />
          </div>
        );

      case 'tag':
        return (
          <div
            className={`w-44 py-3 pl-6 pr-3 rounded-r-md border ${colorConfig.bgClass} ${colorConfig.borderClass} shadow-paper-md flex items-center gap-2`}
            style={{
              clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)',
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-black/30 shrink-0 ml-1" />
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(element.id, { text: e.target.value });
              }}
              placeholder="Project Tag..."
              className="w-full font-mono text-xs font-bold bg-transparent outline-none"
            />
          </div>
        );

      case 'rectangle':
      default:
        return (
          <div
            className={`w-52 h-36 rounded border-2 border-dashed ${colorConfig.bgClass} ${colorConfig.borderClass} shadow-paper-md p-3 flex flex-col justify-between`}
          >
            <input
              type="text"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                onUpdate(element.id, { text: e.target.value });
              }}
              placeholder="Paper cutout box..."
              className="w-full font-sans font-bold text-xs bg-transparent outline-none"
            />
            <span className="text-[9px] font-mono opacity-50 uppercase tracking-wider">Kraft Box</span>
          </div>
        );
    }
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
      {renderShapeBody()}

      {/* Floating Toolbar */}
      <div
        className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-parchment-50 border-stamp px-1.5 py-0.5 rounded shadow-paper-md text-stone-700 text-xs ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity z-50`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onBringToFront(element.id)}
          title="Bring to Top"
          className="p-1 hover:bg-stone-200 rounded"
        >
          <Layers className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDuplicate(element.id)}
          title="Duplicate"
          className="p-1 hover:bg-stone-200 rounded"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={() => onDelete(element.id)}
          title="Delete"
          className="p-1 hover:bg-red-500/20 text-red-700 rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
