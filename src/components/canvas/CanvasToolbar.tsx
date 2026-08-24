import React from 'react';
import { MousePointer2, Square, Circle, StickyNote, Type, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

type CanvasToolbarProps = {
  zoom: number;
  setZoom: (zoom: number) => void;
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onAddSticky?: () => void;
  onAddRect?: () => void;
};

export function CanvasToolbar({ zoom, setZoom, activeTool, setActiveTool, onAddSticky, onAddRect }: CanvasToolbarProps) {
  const handleToolClick = (tool: string, action?: () => void) => {
    if (action) {
      action();
      setActiveTool('select');
    } else {
      setActiveTool(tool);
    }
  };

  return (
    <>
      {/* Tool palette */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-panel border border-workspace-200 p-2 flex flex-col space-y-2 z-10">
        <ToolButton icon={<MousePointer2 size={18} />} active={activeTool === 'select'} onClick={() => handleToolClick('select')} title="Select" />
        <div className="w-full h-px bg-workspace-200 my-1"></div>
        <ToolButton icon={<StickyNote size={18} />} active={activeTool === 'sticky'} onClick={() => handleToolClick('sticky', onAddSticky)} title="Add Sticky Note" />
        <ToolButton icon={<Square size={18} />} active={activeTool === 'rect'} onClick={() => handleToolClick('rect', onAddRect)} title="Add Rectangle" />
        <ToolButton icon={<Circle size={18} />} active={activeTool === 'circle'} onClick={() => handleToolClick('select')} title="Circle (Phase 2)" />
        <ToolButton icon={<Type size={18} />} active={activeTool === 'text'} onClick={() => handleToolClick('select')} title="Text (Phase 2)" />
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-panel border border-workspace-200 p-1 flex items-center space-x-1 z-10">
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1.5 text-workspace-500 hover:text-workspace-800 hover:bg-workspace-100 rounded">
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
        <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1.5 text-workspace-500 hover:text-workspace-800 hover:bg-workspace-100 rounded">
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-4 bg-workspace-200 mx-1"></div>
        <button onClick={() => setZoom(100)} className="p-1.5 text-workspace-500 hover:text-workspace-800 hover:bg-workspace-100 rounded">
          <Maximize size={16} />
        </button>
      </div>
    </>
  );
}

function ToolButton({ icon, active, onClick, title }: { icon: React.ReactNode, active: boolean, onClick: () => void, title: string }) {
  return (
    <button 
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${active ? 'bg-primary-100 text-primary-700' : 'text-workspace-600 hover:bg-workspace-100 hover:text-workspace-900'}`}
    >
      {icon}
    </button>
  );
}
