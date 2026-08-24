import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Trash2, 
  Copy, 
  Layers, 
  Palette, 
  Pin, 
  Move, 
  Sparkles,
  Scissors
} from 'lucide-react';
import { CanvasElement, PaperColor } from '../types/canvas';
import { PAPER_COLOR_CONFIG } from '../utils/constants';
import { WashiTape } from './WashiTape';

interface StickyNoteProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onBringToFront: (id: string) => void;
  onDragStart: (id: string, e: React.PointerEvent) => void;
  zoom: number;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringToFront,
  onDragStart,
  zoom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(element.text || '');
  const [localTitle, setLocalTitle] = useState(element.title || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const colorConfig = PAPER_COLOR_CONFIG[element.color] || PAPER_COLOR_CONFIG.sunflower;

  // Sync external CRDT updates to local input when not actively typing
  useEffect(() => {
    if (element.text !== undefined && !isEditing) {
      setLocalText(element.text);
    }
    if (element.title !== undefined && !isEditing) {
      setLocalTitle(element.title);
    }
  }, [element.text, element.title, isEditing]);

  // Debounced update to Yjs
  const debounceTimerRef = useRef<number | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setLocalText(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onUpdate(element.id, { text: val });
    }, 150);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalTitle(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      onUpdate(element.id, { title: val });
    }, 150);
  };

  const handleColorChange = (colorKey: PaperColor) => {
    onUpdate(element.id, { 
      color: colorKey,
      tapeColor: PAPER_COLOR_CONFIG[colorKey].tapeHex 
    });
    setShowColorPicker(false);
  };

  const toggleAttachmentStyle = () => {
    if (element.hasTape) {
      onUpdate(element.id, { hasTape: false, hasStaple: true });
    } else if (element.hasStaple) {
      onUpdate(element.id, { hasTape: false, hasStaple: false });
    } else {
      onUpdate(element.id, { hasTape: true, hasStaple: false });
    }
  };

  const formattedDate = new Date(element.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      id={`element-${element.id}`}
      className={`absolute select-none transition-shadow group ${
        isSelected ? 'z-40' : ''
      }`}
      style={{
        transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`,
        width: `${element.width || 260}px`,
        minHeight: `${element.height || 200}px`,
        zIndex: isSelected ? 900 : element.zIndex || 1,
      }}
      onClick={(e) => onSelect(element.id, e)}
    >
      {/* Decorative Washi Tape / Staple */}
      {element.hasTape && (
        <WashiTape 
          color={element.tapeColor || colorConfig.tapeHex} 
          angle={-element.rotation * 0.8} 
        />
      )}
      {element.hasStaple && (
        <WashiTape 
          variant="staple" 
          angle={-element.rotation * 0.5} 
        />
      )}

      {/* Main Paper Card */}
      <div
        className={`relative flex flex-col w-full h-full rounded-sm border ${colorConfig.bgClass} ${colorConfig.borderClass} ${
          isSelected 
            ? 'shadow-paper-lift ring-2 ring-riso-indigo ring-offset-2' 
            : 'shadow-paper-md hover:shadow-paper-lg'
        } transition-all duration-150`}
      >
        {/* Top Card Header / Drag Handle */}
        <div
          className={`flex items-center justify-between px-3 py-1.5 border-b border-black/10 cursor-grab active:cursor-grabbing rounded-t-sm ${colorConfig.headerClass}`}
          onPointerDown={(e) => onDragStart(element.id, e)}
        >
          <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2">
            <span className="text-[11px] font-mono opacity-60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: element.authorColor || colorConfig.accentHex }} />
              {element.authorName || 'Artisan'}
            </span>
          </div>

          <span className="text-[10px] font-mono opacity-50 select-none">
            {formattedDate}
          </span>
        </div>

        {/* Note Content Area */}
        <div className="p-3.5 flex-1 flex flex-col gap-2">
          {/* Card Title */}
          <input
            type="text"
            value={localTitle}
            onChange={handleTitleChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => {
              setIsEditing(false);
              onUpdate(element.id, { title: localTitle });
            }}
            placeholder="Untitled Craft Note..."
            className="w-full bg-transparent font-sans font-semibold text-sm outline-none border-b border-transparent hover:border-black/15 focus:border-riso-coral/40 pb-0.5 placeholder:text-black/35"
          />

          {/* Note Body Text */}
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={handleTextChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => {
              setIsEditing(false);
              onUpdate(element.id, { text: localText });
            }}
            placeholder="Type ink notes, tasks, or creative drafts..."
            className="w-full flex-1 bg-transparent font-sans text-xs leading-relaxed outline-none resize-none placeholder:text-black/35 min-h-[100px]"
          />
        </div>

        {/* Card Footer Tools (Appears on Hover / Selection) */}
        <div className={`flex items-center justify-between px-2.5 py-1.5 border-t border-black/5 bg-black/[0.02] text-[11px] ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}>
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            {/* Color Palette Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                title="Change Paper Dye"
                className="p-1 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>

              {/* Color Swatch Flyout */}
              {showColorPicker && (
                <div 
                  className="absolute bottom-7 left-0 bg-parchment-50 border-stamp p-2 rounded shadow-paper-lg flex gap-1.5 z-50 animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(Object.keys(PAPER_COLOR_CONFIG) as PaperColor[]).map((cKey) => (
                    <button
                      key={cKey}
                      onClick={() => handleColorChange(cKey)}
                      title={PAPER_COLOR_CONFIG[cKey].name}
                      className={`w-5 h-5 rounded-full border border-black/20 hover:scale-125 transition-transform ${
                        element.color === cKey ? 'ring-2 ring-riso-indigo ring-offset-1 scale-110' : ''
                      }`}
                      style={{ backgroundColor: PAPER_COLOR_CONFIG[cKey].accentHex }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Tape / Staple Style Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleAttachmentStyle();
              }}
              title="Toggle Tape / Staple"
              className="p-1 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>

            {/* Bring to Front */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBringToFront(element.id);
              }}
              title="Bring to Top"
              className="p-1 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Duplicate */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(element.id);
              }}
              title="Duplicate Card"
              className="p-1 hover:bg-black/10 rounded text-black/70 hover:text-black transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id);
              }}
              title="Discard Note"
              className="p-1 hover:bg-red-500/20 text-red-700 rounded transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Paper Corner Curl Illusion */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-transparent via-black/10 to-black/25 pointer-events-none rounded-br-sm" />
      </div>
    </div>
  );
};
