import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, MapPin } from 'lucide-react';
import { CanvasElement, ViewportState } from '../types/canvas';
import { PAPER_COLOR_CONFIG } from '../utils/constants';

interface MinimapProps {
  elements: CanvasElement[];
  viewport: ViewportState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onCenterContent: () => void;
  onNavigateTo: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  elements,
  viewport,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onCenterContent,
  onNavigateTo,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate bounding box of all elements
  const mapWidth = 160;
  const mapHeight = 110;
  const worldBounds = elements.reduce(
    (acc, el) => ({
      minX: Math.min(acc.minX, el.x),
      minY: Math.min(acc.minY, el.y),
      maxX: Math.max(acc.maxX, el.x + (el.width || 200)),
      maxY: Math.max(acc.maxY, el.y + (el.height || 150)),
    }),
    { minX: 0, minY: 0, maxX: 1600, maxY: 1200 }
  );

  const spanX = Math.max(worldBounds.maxX - worldBounds.minX + 400, 2000);
  const spanY = Math.max(worldBounds.maxY - worldBounds.minY + 400, 1500);

  const scaleX = mapWidth / spanX;
  const scaleY = mapHeight / spanY;
  const mapScale = Math.min(scaleX, scaleY);

  // Viewport representation on minimap
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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none font-mono">
      {/* Zoom Control Bar */}
      <div className="flex items-center gap-1 p-1 bg-[#FFFDF8] border-2 border-stone-800 rounded-full shadow-paper-md text-stone-800">
        <button
          onClick={onZoomOut}
          className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onResetZoom}
          className="px-2 py-0.5 text-xs font-bold font-mono hover:bg-stone-100 rounded transition-colors"
          title="Reset Zoom to 100% (0)"
        >
          {Math.round(viewport.zoom * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-stone-300 mx-0.5" />

        <button
          onClick={onCenterContent}
          className="p-1.5 hover:bg-stone-100 rounded-full transition-colors"
          title="Center All Cards"
        >
          <Maximize2 className="w-4 h-4 text-riso-coral" />
        </button>
      </div>

      {/* Floating Paper Minimap */}
      {isExpanded && (
        <div
          className="w-44 h-32 bg-[#F5EFE6] border-2 border-stone-800 rounded p-1.5 shadow-paper-md relative overflow-hidden cursor-crosshair transition-all"
          onClick={handleMinimapClick}
          title="Click on minimap to jump viewport"
        >
          <div className="absolute top-1 left-2 text-[9px] font-bold uppercase tracking-wider text-stone-500 pointer-events-none">
            Studio Map
          </div>

          {/* Dots in Minimap */}
          <div className="w-full h-full bg-stone-200/50 rounded-xs relative overflow-hidden">
            {elements.map((el) => {
              const elX = (el.x - worldBounds.minX) * mapScale;
              const elY = (el.y - worldBounds.minY) * mapScale;
              const elW = Math.max((el.width || 120) * mapScale, 4);
              const elH = Math.max((el.height || 100) * mapScale, 3);
              const colorHex = PAPER_COLOR_CONFIG[el.color]?.accentHex || '#EAB308';

              return (
                <div
                  key={el.id}
                  className="absolute rounded-[1px] border border-black/30"
                  style={{
                    left: `${Math.max(0, Math.min(elX, mapWidth - 4))}px`,
                    top: `${Math.max(0, Math.min(elY, mapHeight - 4))}px`,
                    width: `${elW}px`,
                    height: `${elH}px`,
                    backgroundColor: colorHex,
                  }}
                />
              );
            })}

            {/* Current Viewport Box */}
            <div
              className="absolute border-2 border-riso-coral bg-riso-coral/15 rounded-[1px] pointer-events-none"
              style={{
                left: `${Math.max(0, Math.min(viewX, mapWidth - 20))}px`,
                top: `${Math.max(0, Math.min(viewY, mapHeight - 15))}px`,
                width: `${Math.max(viewWidth, 16)}px`,
                height: `${Math.max(viewHeight, 12)}px`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
