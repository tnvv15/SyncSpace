import React, { useState, useRef } from 'react';
import { 
  MousePointer, 
  Hand, 
  ArrowRight, 
  Minus, 
  Square, 
  Circle, 
  Diamond, 
  PenTool, 
  Type, 
  StickyNote, 
  Image as ImageIcon, 
  Eraser, 
  Shapes,
  Triangle,
  Star,
  Hexagon,
  Cloud
} from 'lucide-react';
import { ActiveTool, PaperColor } from '../../types/canvas';
import { CANVAS_PALETTES } from '../../utils/canvasConstants';

interface CanvasLeftToolbarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onAddStickyNote: (color?: PaperColor) => void;
  onImageUpload: (file: File) => void;
}

export const CanvasLeftToolbar: React.FC<CanvasLeftToolbarProps> = ({
  activeTool,
  onSelectTool,
  onAddStickyNote,
  onImageUpload,
}) => {
  const [showMoreShapes, setShowMoreShapes] = useState(false);
  const [showStickyPalette, setShowStickyPalette] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
      // Reset input value so same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const isMoreShapeActive = ['triangle', 'star', 'hexagon', 'cloud'].includes(activeTool);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <aside className="absolute left-5 top-1/2 -translate-y-1/2 z-30 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl border border-workspace-200 shadow-panel p-1.5 space-y-1 select-none">
        {/* 1. Select / Cursor (V) */}
        <ToolbarToolButton
          icon={<MousePointer className="w-4 h-4" />}
          label="Select (V)"
          active={activeTool === 'select'}
          onClick={() => onSelectTool('select')}
        />

        {/* 2. Hand / Pan (H) */}
        <ToolbarToolButton
          icon={<Hand className="w-4 h-4" />}
          label="Hand / Pan (H or Space+Drag)"
          active={activeTool === 'pan'}
          onClick={() => onSelectTool('pan')}
        />

        <div className="w-full h-px bg-workspace-200 my-1" />

        {/* 3. Arrow / Connector (A) */}
        <ToolbarToolButton
          icon={<ArrowRight className="w-4 h-4" />}
          label="Arrow / Connector (A)"
          active={activeTool === 'arrow'}
          onClick={() => onSelectTool('arrow')}
        />

        {/* 4. Line (L) */}
        <ToolbarToolButton
          icon={<Minus className="w-4 h-4 rotate-45" />}
          label="Line (L)"
          active={activeTool === 'line'}
          onClick={() => onSelectTool('line')}
        />

        {/* 5. Rectangle (R) */}
        <ToolbarToolButton
          icon={<Square className="w-4 h-4" />}
          label="Rectangle (R)"
          active={activeTool === 'rectangle'}
          onClick={() => onSelectTool('rectangle')}
        />

        {/* 6. Circle / Ellipse (O) */}
        <ToolbarToolButton
          icon={<Circle className="w-4 h-4" />}
          label="Circle / Ellipse (O)"
          active={activeTool === 'circle'}
          onClick={() => onSelectTool('circle')}
        />

        {/* 7. Diamond (D) */}
        <ToolbarToolButton
          icon={<Diamond className="w-4 h-4" />}
          label="Diamond (D)"
          active={activeTool === 'diamond'}
          onClick={() => onSelectTool('diamond')}
        />

        {/* 8. Freehand Drawing / Pencil (P) */}
        <ToolbarToolButton
          icon={<PenTool className="w-4 h-4" />}
          label="Freehand Pencil (P)"
          active={activeTool === 'draw'}
          onClick={() => onSelectTool('draw')}
        />

        {/* 9. Text (T) */}
        <ToolbarToolButton
          icon={<Type className="w-4 h-4" />}
          label="Text (T)"
          active={activeTool === 'text'}
          onClick={() => onSelectTool('text')}
        />

        {/* 10. Sticky Note (S) with palette flyout */}
        <div className="relative">
          <ToolbarToolButton
            icon={<StickyNote className="w-4 h-4 text-amber-500" />}
            label="Sticky Note (S)"
            active={activeTool === 'sticky'}
            onClick={() => {
              onSelectTool('sticky');
              setShowStickyPalette(!showStickyPalette);
              setShowMoreShapes(false);
            }}
          />

          {showStickyPalette && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowStickyPalette(false)} />
              <div className="absolute left-12 top-0 bg-white border border-workspace-200 rounded-xl shadow-dropdown p-2 z-50 flex flex-col space-y-1 w-36 animate-fade-in">
                <div className="text-[10px] font-bold text-workspace-400 uppercase tracking-wider px-1">
                  Note Color
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {CANVAS_PALETTES.stickyColors.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => {
                        onAddStickyNote(c.key as PaperColor);
                        setShowStickyPalette(false);
                      }}
                      title={c.name}
                      className="w-6 h-6 rounded-md border border-black/15 shadow-2xs hover:scale-125 transition-transform"
                      style={{ backgroundColor: c.bg }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 11. Image Upload */}
        <ToolbarToolButton
          icon={<ImageIcon className="w-4 h-4" />}
          label="Upload Image (from device)"
          active={activeTool === 'image'}
          onClick={() => {
            onSelectTool('image');
            fileInputRef.current?.click();
          }}
        />

        {/* 12. Eraser (E) */}
        <ToolbarToolButton
          icon={<Eraser className="w-4 h-4 text-rose-500" />}
          label="Eraser (E)"
          active={activeTool === 'eraser'}
          onClick={() => onSelectTool('eraser')}
        />

        <div className="w-full h-px bg-workspace-200 my-1" />

        {/* 13. More Shapes Dropdown */}
        <div className="relative">
          <ToolbarToolButton
            icon={<Shapes className="w-4 h-4" />}
            label="More Shapes (Triangle, Star, Hexagon, Cloud)"
            active={isMoreShapeActive || showMoreShapes}
            onClick={() => {
              setShowMoreShapes(!showMoreShapes);
              setShowStickyPalette(false);
            }}
          />

          {showMoreShapes && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreShapes(false)} />
              <div className="absolute left-12 bottom-0 bg-white border border-workspace-200 rounded-xl shadow-dropdown p-1.5 z-50 flex flex-col space-y-1 w-40 text-xs text-workspace-700 animate-fade-in">
                <div className="text-[10px] font-bold text-workspace-400 uppercase tracking-wider px-2 py-1">
                  Special Shapes
                </div>
                <button
                  onClick={() => {
                    onSelectTool('triangle');
                    setShowMoreShapes(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeTool === 'triangle' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-workspace-100'
                  }`}
                >
                  <Triangle className="w-3.5 h-3.5 text-primary-600" />
                  <span>Triangle</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('star');
                    setShowMoreShapes(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeTool === 'star' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-workspace-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>Star</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('hexagon');
                    setShowMoreShapes(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeTool === 'hexagon' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-workspace-100'
                  }`}
                >
                  <Hexagon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hexagon</span>
                </button>
                <button
                  onClick={() => {
                    onSelectTool('cloud');
                    setShowMoreShapes(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center space-x-2 transition-colors ${
                    activeTool === 'cloud' ? 'bg-primary-50 text-primary-700 font-semibold' : 'hover:bg-workspace-100'
                  }`}
                >
                  <Cloud className="w-3.5 h-3.5 text-sky-500" />
                  <span>Cloud</span>
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

function ToolbarToolButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        onClick={onClick}
        className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
          active
            ? 'bg-primary-600 text-white shadow-xs scale-105'
            : 'text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900'
        }`}
      >
        {icon}
      </button>

      {/* Modern Tooltip */}
      <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 bg-workspace-900 text-white text-[11px] font-medium px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}
