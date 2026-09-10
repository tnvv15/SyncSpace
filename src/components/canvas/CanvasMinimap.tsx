import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Map as MapIcon, 
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CanvasElement, ViewportState } from '../../types/canvas';

interface CanvasMinimapProps {
  elements: CanvasElement[];
  viewport: ViewportState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onFitToScreen: () => void;
  onNavigateTo: (worldX: number, worldY: number) => void;
  onToggleLayers: () => void;
  isLayersOpen: boolean;
}

export const CanvasMinimap: React.FC<CanvasMinimapProps> = ({
  elements,
  viewport,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitToScreen,
  onNavigateTo,
  onToggleLayers,
  isLayersOpen,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate world bounding box of all elements
  const mapWidth = 170;
  const mapHeight = 110;

  const worldBounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.x),
      minY: Math.min(acc.minY, el.y),
      maxX: Math.max(acc.maxX, el.x + (el.width || 100)),
      maxY: Math.max(acc.maxY, el.y + (el.height || 80)),
    }),
    { minX: 0, minY: 0, maxX: 1400, maxY: 900 }
  );

  const spanX = Math.max(worldBounds.maxX - worldBounds.minX + 400, 2000);
  const spanY = Math.max(worldBounds.maxY - worldBounds.minY + 400, 1400);

  const scaleX = mapWidth / spanX;
  const scaleY = mapHeight / spanY;
  const mapScale = Math.min(scaleX, scaleY);

  // Viewport camera indicator on minimap
  const viewWidth = (window.innerWidth / viewport.zoom) * mapScale;
  const viewHeight = (window.innerHeight / viewport.zoom) * mapScale;
  const viewX = (-viewport.x / viewport.zoom - worldBounds.minX) * mapScale;
  const viewY = (-viewport.y / viewport.zoom - worldBounds.minY) * mapScale;

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetWorldX = clickX / mapScale + worldBounds.minX;
    const targetWorldY = clickY / mapScale + worldBounds.minY;

    onNavigateTo(targetWorldX, targetWorldY);
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end space-y-2 select-none">
      {/* Zoom Control Pill Dock */}
      <div className="flex items-center bg-white/95 backdrop-blur-md border border-workspace-200 rounded-2xl shadow-panel p-1 space-x-1 text-workspace-700">
        <button
          onClick={onZoomOut}
          className="p-1.5 hover:bg-workspace-100 rounded-xl transition-colors"
          title="Zoom Out (Ctrl -)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onResetZoom}
          className="px-2 py-1 text-xs font-bold text-workspace-800 hover:bg-workspace-100 rounded-lg transition-colors font-mono w-14 text-center"
          title="Reset Zoom (100%)"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          className="p-1.5 hover:bg-workspace-100 rounded-xl transition-colors"
          title="Zoom In (Ctrl +)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-workspace-200 mx-0.5" />

        <button
          onClick={onFitToScreen}
          className="p-1.5 hover:bg-workspace-100 rounded-xl transition-colors text-primary-600"
          title="Fit All Content on Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-workspace-200 mx-0.5" />

        {/* Layers Toggle */}
        <button
          onClick={onToggleLayers}
          className={`p-1.5 rounded-xl transition-colors ${
            isLayersOpen ? 'bg-primary-50 text-primary-700' : 'hover:bg-workspace-100 text-workspace-600'
          }`}
          title="Toggle Layers Panel"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Minimap Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1.5 rounded-xl transition-colors ${
            isExpanded ? 'bg-workspace-100 text-workspace-900' : 'hover:bg-workspace-100 text-workspace-500'
          }`}
          title="Toggle Minimap"
        >
          <MapIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Interactive Minimap */}
      {isExpanded && (
        <div
          className="w-48 h-32 bg-white/95 backdrop-blur-md border border-workspace-200 rounded-2xl p-2 shadow-panel relative overflow-hidden cursor-crosshair animate-fade-in"
          onClick={handleMinimapClick}
          title="Click or drag to navigate canvas"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-workspace-400">
              Canvas Minimap
            </span>
            <span className="text-[9px] text-workspace-400 font-mono">
              {elements.length} items
            </span>
          </div>

          {/* Minimap Viewport Container */}
          <div className="w-full h-24 bg-workspace-50/80 border border-workspace-200/60 rounded-lg relative overflow-hidden">
            {/* Miniature Elements Representation */}
            {elements.map((el) => {
              if (el.isHidden) return null;
              const elX = (el.x - worldBounds.minX) * mapScale;
              const elY = (el.y - worldBounds.minY) * mapScale;
              const elW = Math.max((el.width || 80) * mapScale, 3);
              const elH = Math.max((el.height || 60) * mapScale, 2.5);

              return (
                <div
                  key={el.id}
                  className="absolute rounded-[1px]"
                  style={{
                    left: `${Math.max(0, Math.min(elX, mapWidth - 4))}px`,
                    top: `${Math.max(0, Math.min(elY, mapHeight - 4))}px`,
                    width: `${elW}px`,
                    height: `${elH}px`,
                    backgroundColor: el.fillColor && el.fillColor !== '#FFFFFF' && el.fillColor !== 'transparent'
                      ? el.fillColor
                      : el.strokeColor || '#00667E',
                    opacity: 0.85,
                  }}
                />
              );
            })}

            {/* Current Visible Viewport Camera Rectangle */}
            <div
              className="absolute border-2 border-primary-500 bg-primary-500/15 rounded-[2px] pointer-events-none transition-all duration-75"
              style={{
                left: `${Math.max(0, Math.min(viewX, mapWidth - 20))}px`,
                top: `${Math.max(0, Math.min(viewY, mapHeight - 15))}px`,
                width: `${Math.max(viewWidth, 18)}px`,
                height: `${Math.max(viewHeight, 14)}px`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
