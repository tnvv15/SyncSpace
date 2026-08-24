import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasItem } from '../../context/WorkspaceContext';

type CanvasBoardProps = {
  workspaceState: ReturnType<typeof useWorkspace>;
};

export function CanvasBoard({ workspaceState }: CanvasBoardProps) {
  const [zoom, setZoom] = useState(100);
  const [activeTool, setActiveTool] = useState('select');
  const boardRef = useRef<HTMLDivElement>(null);

  const { canvasItems, currentDocId, updateCanvasItem, deleteCanvasItem, addCanvasItem } = workspaceState;
  const items = currentDocId ? canvasItems[currentDocId] || [] : [];

  const [draggedItem, setDraggedItem] = useState<{ id: string, startX: number, startY: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent, item: CanvasItem) => {
    if (activeTool !== 'select') return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDraggedItem({ id: item.id, startX: e.clientX, startY: e.clientY });
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent, item: CanvasItem) => {
    if (draggedItem && draggedItem.id === item.id && currentDocId) {
      const dx = (e.clientX - draggedItem.startX) / (zoom / 100);
      const dy = (e.clientY - draggedItem.startY) / (zoom / 100);
      
      updateCanvasItem(currentDocId, {
        ...item,
        x: item.x + dx,
        y: item.y + dy
      });
      setDraggedItem({ id: item.id, startX: e.clientX, startY: e.clientY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDraggedItem(null);
  };

  const handleTextChange = (id: string, text: string) => {
    if (!currentDocId) return;
    const item = items.find(i => i.id === id);
    if (item) {
      updateCanvasItem(currentDocId, { ...item, text });
    }
  };

  const handleAddSticky = () => {
    if (currentDocId) {
      addCanvasItem(currentDocId, { type: 'sticky', x: 300, y: 300, color: 'bg-yellow-100', text: 'New Note' });
    }
  };
  const handleAddRect = () => {
    if (currentDocId) {
      addCanvasItem(currentDocId, { type: 'rect', x: 300, y: 300, w: 200, h: 100, text: 'New Shape' });
    }
  };

  return (
    <div 
      className="h-full w-full bg-workspace-100 relative overflow-hidden" 
      style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ref={boardRef}
    >
      
      <CanvasToolbar 
        zoom={zoom} 
        setZoom={setZoom} 
        activeTool={activeTool} 
        setActiveTool={setActiveTool}
        onAddSticky={handleAddSticky}
        onAddRect={handleAddRect}
      />

      <div className="relative w-full h-full transform-origin-top-left" style={{ transform: `scale(${zoom / 100})` }}>
        {/* Mock Connectors - static for demo */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <path d="M 650 170 L 750 170" stroke="#9CA3AF" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 850 220 L 850 300" stroke="#9CA3AF" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#9CA3AF" />
            </marker>
          </defs>
        </svg>

        {items.map(item => (
          <div 
            key={item.id}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onPointerMove={(e) => handlePointerMove(e, item)}
            onPointerUp={handlePointerUp}
            className={`absolute shadow-md flex flex-col p-4 text-sm font-medium group transition-shadow
              ${activeTool === 'select' ? 'cursor-grab active:cursor-grabbing' : ''}
              ${item.type === 'sticky' ? `${item.color} shadow-lg rounded-sm` : ''}
              ${item.type === 'rect' ? 'bg-white border-2 border-primary-500 rounded-lg shadow-sm justify-center items-center' : ''}
              ${item.type === 'circle' ? 'bg-white border-2 border-workspace-400 rounded-full shadow-sm justify-center items-center' : ''}
            `}
            style={{ 
              left: item.x, 
              top: item.y,
              width: item.w || (item.type === 'circle' ? item.r : 160),
              height: item.h || (item.type === 'circle' ? item.r : 160)
            }}
          >
            {/* Delete button (Phase 1) */}
            <button 
              onClick={(e) => { e.stopPropagation(); currentDocId && deleteCanvasItem(currentDocId, item.id); }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 z-10 transition-opacity"
            >
              ×
            </button>

            {item.type === 'sticky' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-red-400/20 backdrop-blur-sm shadow-sm" style={{ transform: 'rotate(-2deg)' }}></div>
            )}
            <textarea
               value={item.text}
               onChange={(e) => handleTextChange(item.id, e.target.value)}
               className={`w-full h-full bg-transparent resize-none outline-none ${item.type === 'sticky' ? 'text-left' : 'text-center'} overflow-hidden`}
               onPointerDown={e => e.stopPropagation()} // Stop dragging when editing text
            />
          </div>
        ))}
      </div>
    </div>
  );
}
