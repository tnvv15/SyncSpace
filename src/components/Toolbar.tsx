import React, { useState } from 'react';
import { 
  StickyNote, 
  BookOpen, 
  Stamp, 
  Shapes, 
  Trash2, 
  Share2, 
  Download, 
  HelpCircle, 
  Sparkles, 
  FolderSync,
  Plus,
  MousePointer,
  Hand,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  Lightbulb,
  CheckCheck
} from 'lucide-react';
import { ActiveTool, PaperColor, StampVariant, ShapeVariant } from '../types/canvas';
import { PAPER_COLOR_CONFIG, STAMP_CONFIG } from '../utils/constants';
import confetti from 'canvas-confetti';

interface ToolbarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  onAddStickyNote: (color?: PaperColor) => void;
  onAddTextBlock: () => void;
  onAddStamp: (stampType: StampVariant) => void;
  onAddShape: (shapeType: ShapeVariant) => void;
  onClearCanvas: () => void;
  onOpenRoomModal: () => void;
  onOpenHelpModal: () => void;
  onExportJSON: () => void;
  roomId: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onSelectTool,
  onAddStickyNote,
  onAddTextBlock,
  onAddStamp,
  onAddShape,
  onClearCanvas,
  onOpenRoomModal,
  onOpenHelpModal,
  onExportJSON,
  roomId,
}) => {
  const [showStampMenu, setShowStampMenu] = useState(false);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showColorFlyout, setShowColorFlyout] = useState(false);

  const triggerStampConfetti = () => {
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.85 },
      colors: ['#E05A47', '#EAB308', '#52796F', '#1E293B'],
    });
  };

  return (
    <>
      {/* Floating Bottom Center Craft Tool Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-2 bg-[#FFFDF8] border-2 border-stone-800 rounded-full shadow-dock select-none">
        {/* Select / Pointer Tool */}
        <button
          onClick={() => onSelectTool('select')}
          className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'select'
              ? 'bg-riso-indigo text-white shadow-stamp-active'
              : 'hover:bg-stone-100 text-stone-800'
          }`}
          title="Select & Move (V)"
        >
          <MousePointer className="w-4 h-4" />
        </button>

        {/* Hand / Pan Tool */}
        <button
          onClick={() => onSelectTool('pan')}
          className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
            activeTool === 'pan'
              ? 'bg-riso-indigo text-white shadow-stamp-active'
              : 'hover:bg-stone-100 text-stone-800'
          }`}
          title="Pan Surface (Space + Drag / H)"
        >
          <Hand className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-stone-300 mx-0.5" />

        {/* Add Sticky Note Button with Color Popover */}
        <div className="relative">
          <div className="flex items-center">
            <button
              onClick={() => onAddStickyNote()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-l-full bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#CA8A04] font-mono font-bold text-xs shadow-paper-sm transition-transform active:scale-95"
              title="Add Sticky Note (N)"
            >
              <StickyNote className="w-4 h-4" />
              <span>+ Note</span>
            </button>
            <button
              onClick={() => setShowColorFlyout(!showColorFlyout)}
              className="px-1.5 py-2 rounded-r-full bg-[#FDE047] hover:bg-[#FACC15] text-[#713F12] border-t border-b border-r border-[#CA8A04] text-xs"
              title="Choose Paper Dye"
            >
              ▾
            </button>
          </div>

          {/* Color Flyout */}
          {showColorFlyout && (
            <>
              <div className="fixed inset-0" onClick={() => setShowColorFlyout(false)} />
              <div className="absolute bottom-12 left-0 bg-[#FFFDF8] border-stamp p-2 rounded shadow-paper-lg flex gap-1.5 z-50 animate-fade-in">
                {(Object.keys(PAPER_COLOR_CONFIG) as PaperColor[]).map((cKey) => (
                  <button
                    key={cKey}
                    onClick={() => {
                      onAddStickyNote(cKey);
                      setShowColorFlyout(false);
                    }}
                    title={`Add ${PAPER_COLOR_CONFIG[cKey].name} Note`}
                    className="w-6 h-6 rounded-full border border-black/20 hover:scale-125 transition-transform"
                    style={{ backgroundColor: PAPER_COLOR_CONFIG[cKey].accentHex }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Add Text Block / Index Card */}
        <button
          onClick={() => onAddTextBlock()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#FFF9ED] hover:bg-[#FDF2D9] text-stone-800 border border-stone-400 font-mono font-bold text-xs shadow-paper-sm transition-transform active:scale-95"
          title="Add Index Card (T)"
        >
          <BookOpen className="w-4 h-4 text-riso-coral" />
          <span>+ Card</span>
        </button>

        {/* Risograph Stamp Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowStampMenu(!showStampMenu);
              setShowShapeMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border border-stone-800 font-mono font-bold text-xs shadow-paper-sm transition-transform active:scale-95 ${
              showStampMenu ? 'bg-riso-coral text-white' : 'bg-[#FFFDF8] hover:bg-stone-100 text-stone-800'
            }`}
            title="Apply Risograph Seal / Stamp"
          >
            <Stamp className="w-4 h-4 text-riso-coral" />
            <span>Stamp</span>
          </button>

          {showStampMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowStampMenu(false)} />
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-[#FFFDF8] border-stamp rounded p-2.5 shadow-paper-lg grid grid-cols-2 gap-2 z-50 animate-fade-in">
                {(Object.keys(STAMP_CONFIG) as StampVariant[]).map((sKey) => {
                  const stamp = STAMP_CONFIG[sKey];
                  return (
                    <button
                      key={sKey}
                      onClick={() => {
                        onAddStamp(sKey);
                        triggerStampConfetti();
                        setShowStampMenu(false);
                      }}
                      className={`px-2 py-1.5 rounded font-mono font-black text-[11px] uppercase tracking-wider text-center border transition-transform hover:scale-105 active:scale-95`}
                      style={{
                        color: stamp.inkColor,
                        borderColor: stamp.inkColor,
                        backgroundColor: `${stamp.inkColor}10`,
                      }}
                    >
                      {stamp.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Paper Shapes Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowShapeMenu(!showShapeMenu);
              setShowStampMenu(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border border-stone-800 font-mono font-bold text-xs shadow-paper-sm transition-transform active:scale-95 ${
              showShapeMenu ? 'bg-riso-sage text-white' : 'bg-[#FFFDF8] hover:bg-stone-100 text-stone-800'
            }`}
            title="Add Kraft Cutout / Shape"
          >
            <Shapes className="w-4 h-4 text-riso-sage" />
            <span>Cutout</span>
          </button>

          {showShapeMenu && (
            <>
              <div className="fixed inset-0" onClick={() => setShowShapeMenu(false)} />
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-52 bg-[#FFFDF8] border-stamp rounded p-2 shadow-paper-lg flex flex-col gap-1.5 z-50 animate-fade-in text-xs font-mono">
                <button
                  onClick={() => {
                    onAddShape('polaroid');
                    setShowShapeMenu(false);
                  }}
                  className="px-2.5 py-1.5 text-left rounded hover:bg-parchment-200 flex items-center gap-2"
                >
                  <span>📷</span> Polaroid Frame
                </button>
                <button
                  onClick={() => {
                    onAddShape('circle');
                    setShowShapeMenu(false);
                  }}
                  className="px-2.5 py-1.5 text-left rounded hover:bg-parchment-200 flex items-center gap-2"
                >
                  <span>⭕</span> Stamped Circular Badge
                </button>
                <button
                  onClick={() => {
                    onAddShape('banner');
                    setShowShapeMenu(false);
                  }}
                  className="px-2.5 py-1.5 text-left rounded hover:bg-parchment-200 flex items-center gap-2"
                >
                  <span>🚩</span> Section Ribbon Banner
                </button>
                <button
                  onClick={() => {
                    onAddShape('tag');
                    setShowShapeMenu(false);
                  }}
                  className="px-2.5 py-1.5 text-left rounded hover:bg-parchment-200 flex items-center gap-2"
                >
                  <span>🏷️</span> Kraft Luggage Tag
                </button>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-6 bg-stone-300 mx-0.5" />

        {/* Clear Board */}
        <button
          onClick={onClearCanvas}
          className="p-2.5 rounded-full hover:bg-red-50 text-red-700 transition-colors"
          title="Clear Board Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportJSON}
          className="p-2.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
          title="Export Workspace to JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Help Cheatsheet */}
        <button
          onClick={onOpenHelpModal}
          className="p-2.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
          title="Studio Guide & Shortcuts (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
