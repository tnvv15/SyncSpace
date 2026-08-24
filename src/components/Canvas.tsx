import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  CanvasElement, 
  ViewportState, 
  ActiveTool, 
  UserPresence, 
  PaperColor, 
  StampVariant, 
  ShapeVariant 
} from '../types/canvas';
import { StickyNote } from './StickyNote';
import { TextBlock } from './TextBlock';
import { StampElement } from './StampElement';
import { PaperShape } from './PaperShape';
import { RemoteCursor } from './RemoteCursor';

interface CanvasProps {
  elements: CanvasElement[];
  remoteUsers: UserPresence[];
  activeTool: ActiveTool;
  viewport: ViewportState;
  onViewportChange: (viewport: ViewportState) => void;
  onBroadcastCursor: (cursor: { x: number; y: number } | null, tool?: ActiveTool) => void;
  onAddElementAt: (worldX: number, worldY: number) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onBringToFront: (id: string) => void;
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  remoteUsers,
  activeTool,
  viewport,
  onViewportChange,
  onBroadcastCursor,
  onAddElementAt,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringToFront,
  selectedId,
  onSelectElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; viewX: number; viewY: number }>({
    x: 0,
    y: 0,
    viewX: 0,
    viewY: 0,
  });

  // Dragging single element state
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number; elemStartX: number; elemStartY: number }>({
    x: 0,
    y: 0,
    elemStartX: 0,
    elemStartY: 0,
  });

  // Convert Screen coordinates to Canvas World coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - viewport.x) / viewport.zoom,
      y: (screenY - viewport.y) / viewport.zoom,
    };
  }, [viewport]);

  // Handle pointer move over canvas (for pan, element drag, and cursor broadcasting)
  const handlePointerMove = (e: React.PointerEvent) => {
    const worldPos = screenToWorld(e.clientX, e.clientY);
    onBroadcastCursor(worldPos, activeTool);

    // Handle Canvas Panning
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      onViewportChange({
        ...viewport,
        x: panStartRef.current.viewX + dx,
        y: panStartRef.current.viewY + dy,
      });
      return;
    }

    // Handle Element Dragging
    if (draggingElementId) {
      const dx = (e.clientX - dragOffsetRef.current.x) / viewport.zoom;
      const dy = (e.clientY - dragOffsetRef.current.y) / viewport.zoom;
      
      const newX = Math.round(dragOffsetRef.current.elemStartX + dx);
      const newY = Math.round(dragOffsetRef.current.elemStartY + dy);

      onUpdateElement(draggingElementId, {
        x: newX,
        y: newY,
      });
    }
  };

  // Handle pointer down on background surface
  const handlePointerDown = (e: React.PointerEvent) => {
    // If middle click (button 1) or alt key or Pan tool active -> start panning
    if (e.button === 1 || activeTool === 'pan' || e.altKey) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        viewX: viewport.x,
        viewY: viewport.y,
      };
      if (containerRef.current) {
        containerRef.current.setPointerCapture(e.pointerId);
      }
      return;
    }

    // Normal left click on canvas background -> Deselect element or click-to-add if specific tool
    if (e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-world') {
      onSelectElement(null);
      if (activeTool !== 'select' && (activeTool as string) !== 'pan') {
        const worldPos = screenToWorld(e.clientX, e.clientY);
        onAddElementAt(worldPos.x, worldPos.y);
      }
    }
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      try {
        if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
          containerRef.current.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }

    if (draggingElementId) {
      setDraggingElementId(null);
    }
  };

  // Handle mouse leave (stop broadcasting cursor)
  const handlePointerLeave = () => {
    onBroadcastCursor(null);
    if (isPanning) setIsPanning(false);
    if (draggingElementId) setDraggingElementId(null);
  };

  // Handle Zoom Wheel with pinch and trackpad zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = -e.deltaY * 0.0015;
      const newZoom = Math.min(Math.max(viewport.zoom * (1 + zoomFactor), 0.15), 3.0);

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const newX = mouseX - ((mouseX - viewport.x) / viewport.zoom) * newZoom;
      const newY = mouseY - ((mouseY - viewport.y) / viewport.zoom) * newZoom;

      onViewportChange({
        x: newX,
        y: newY,
        zoom: newZoom,
      });
    } else {
      // Pan with 2-finger swipe / scroll
      onViewportChange({
        ...viewport,
        x: viewport.x - e.deltaX,
        y: viewport.y - e.deltaY,
      });
    }
  };

  // Double click canvas to quick create note
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).id === 'canvas-world') {
      const worldPos = screenToWorld(e.clientX, e.clientY);
      onAddElementAt(worldPos.x - 120, worldPos.y - 80);
    }
  };

  // Start dragging an element
  const handleElementDragStart = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    onSelectElement(id);
    onBringToFront(id);

    const elem = elements.find((el) => el.id === id);
    if (!elem) return;

    setDraggingElementId(id);
    dragOffsetRef.current = {
      x: e.clientX,
      y: e.clientY,
      elemStartX: elem.x,
      elemStartY: elem.y,
    };
  };

  return (
    <div
      ref={containerRef}
      id="canvas-viewport"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      className={`relative w-full h-full overflow-hidden bg-canvas-dots ${
        isPanning ? 'cursor-grabbing' : activeTool === 'pan' ? 'cursor-grab' : 'cursor-default'
      }`}
      style={{
        backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`,
      }}
    >
      {/* Paper Grain Overlay */}
      <div className="paper-grain-overlay" />

      {/* World Plane transformed by Viewport Pan & Zoom */}
      <div
        id="canvas-world"
        className="absolute top-0 left-0 origin-top-left w-full h-full pointer-events-auto"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        }}
      >
        {/* Render Canvas Elements */}
        {elements.map((element) => {
          const isSelected = selectedId === element.id;

          switch (element.type) {
            case 'card':
              return (
                <TextBlock
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    onSelectElement(id);
                  }}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                  onDuplicate={onDuplicateElement}
                  onBringToFront={onBringToFront}
                  onDragStart={handleElementDragStart}
                  zoom={viewport.zoom}
                />
              );

            case 'stamp':
              return (
                <StampElement
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    onSelectElement(id);
                  }}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                  onDuplicate={onDuplicateElement}
                  onBringToFront={onBringToFront}
                  onDragStart={handleElementDragStart}
                />
              );

            case 'shape':
              return (
                <PaperShape
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    onSelectElement(id);
                  }}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                  onDuplicate={onDuplicateElement}
                  onBringToFront={onBringToFront}
                  onDragStart={handleElementDragStart}
                />
              );

            case 'sticky':
            default:
              return (
                <StickyNote
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={(id, e) => {
                    e.stopPropagation();
                    onSelectElement(id);
                  }}
                  onUpdate={onUpdateElement}
                  onDelete={onDeleteElement}
                  onDuplicate={onDuplicateElement}
                  onBringToFront={onBringToFront}
                  onDragStart={handleElementDragStart}
                  zoom={viewport.zoom}
                />
              );
          }
        })}

        {/* Real-Time Multiplayer Remote Fountain Pen Cursors */}
        {remoteUsers.map((user) => (
          <RemoteCursor key={user.clientId} user={user} zoom={viewport.zoom} />
        ))}
      </div>
    </div>
  );
};
