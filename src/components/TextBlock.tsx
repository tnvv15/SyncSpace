import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Copy, Layers, Pin, BookOpen } from 'lucide-react';
import { CanvasElement } from '../types/canvas';
import { WashiTape } from './WashiTape';

interface TextBlockProps {
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

export const TextBlock: React.FC<TextBlockProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onBringToFront,
  onDragStart,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(element.text || '');
  const [localTitle, setLocalTitle] = useState(element.title || '');
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (element.text !== undefined && !isEditing) {
      setLocalText(element.text);
    }
    if (element.title !== undefined && !isEditing) {
      setLocalTitle(element.title);
    }
  }, [element.text, element.title, isEditing]);

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

  return (
    <div
      id={`element-${element.id}`}
      className={`absolute select-none group ${isSelected ? 'z-40' : ''}`}
      style={{
        transform: `translate(${element.x}px, ${element.y}px) rotate(${element.rotation || 0}deg)`,
        width: `${element.width || 340}px`,
        minHeight: `${element.height || 220}px`,
        zIndex: isSelected ? 900 : element.zIndex || 1,
      }}
      onClick={(e) => onSelect(element.id, e)}
    >
      {/* Decorative metal paperclip on corner */}
      <WashiTape variant="paperclip" angle={-8} />

      {/* Index Card Container */}
      <div
        className={`relative flex flex-col w-full h-full bg-lined-paper border border-[#D6C7B2] rounded-sm ${
          isSelected 
            ? 'shadow-paper-lift ring-2 ring-riso-indigo ring-offset-2' 
            : 'shadow-paper-md hover:shadow-paper-lg'
        } transition-all duration-150 overflow-hidden`}
      >
        {/* Index Card Top Header */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b-2 border-red-400/40 bg-[#FFF9ED] cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => onDragStart(element.id, e)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-riso-coral shrink-0" />
            <input
              type="text"
              value={localTitle}
              onChange={handleTitleChange}
              onFocus={() => setIsEditing(true)}
              onBlur={() => {
                setIsEditing(false);
                onUpdate(element.id, { title: localTitle });
              }}
              placeholder="Index Card Title..."
              className="bg-transparent font-serif italic font-bold text-sm text-riso-charcoal outline-none w-full placeholder:text-black/30"
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-riso-sage font-semibold shrink-0 ml-2">
            REC. #{element.id.slice(-4).toUpperCase()}
          </span>
        </div>

        {/* Ruled Lines Content */}
        <div className="p-4 flex-1 flex flex-col">
          <textarea
            value={localText}
            onChange={handleTextChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => {
              setIsEditing(false);
              onUpdate(element.id, { text: localText });
            }}
            placeholder="Draft storyboards, technical specifications, or craft recipes..."
            className="w-full flex-1 bg-transparent font-mono text-xs text-stone-800 leading-[28px] outline-none resize-none placeholder:text-stone-400 min-h-[140px]"
          />
        </div>

        {/* Index Card Footer Bar */}
        <div className={`flex items-center justify-between px-3 py-1.5 bg-[#F5EFE6] border-t border-[#E2D7C0] text-[11px] font-mono text-stone-600 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}>
          <div className="flex items-center gap-2">
            <span>By: {element.authorName || 'Artisan'}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBringToFront(element.id);
              }}
              title="Bring to Top"
              className="p-1 hover:bg-stone-300/60 rounded"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(element.id);
              }}
              title="Duplicate Card"
              className="p-1 hover:bg-stone-300/60 rounded"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(element.id);
              }}
              title="Delete Card"
              className="p-1 hover:bg-red-500/20 text-red-700 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
