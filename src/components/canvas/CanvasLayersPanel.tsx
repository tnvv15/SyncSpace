import React from 'react';
import { 
  CanvasElement 
} from '../../types/canvas';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Square,
  Circle,
  Diamond,
  PenTool,
  Type,
  StickyNote,
  Image as ImageIcon,
  ArrowRight,
  Minus,
  Shapes,
  X
} from 'lucide-react';

interface CanvasLayersPanelProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  selectedIds: string[];
  onSelectElement: (id: string, multi: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElements: (ids: string[]) => void;
  onBringToFront: (ids: string[]) => void;
  onSendToBack: (ids: string[]) => void;
}

export const CanvasLayersPanel: React.FC<CanvasLayersPanelProps> = ({
  isOpen,
  onClose,
  elements,
  selectedIds,
  onSelectElement,
  onUpdateElement,
  onDeleteElements,
  onBringToFront,
  onSendToBack,
}) => {
  if (!isOpen) return null;

  // Render in top-to-bottom visual order (highest zIndex first)
  const sortedElements = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'rectangle':
        return <Square className="w-3.5 h-3.5 text-primary-600" />;
      case 'circle':
        return <Circle className="w-3.5 h-3.5 text-sky-600" />;
      case 'diamond':
        return <Diamond className="w-3.5 h-3.5 text-amber-600" />;
      case 'sticky':
        return <StickyNote className="w-3.5 h-3.5 text-amber-500" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-workspace-700" />;
      case 'arrow':
        return <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />;
      case 'line':
        return <Minus className="w-3.5 h-3.5 text-workspace-600 rotate-45" />;
      case 'draw':
        return <PenTool className="w-3.5 h-3.5 text-purple-600" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Shapes className="w-3.5 h-3.5 text-workspace-600" />;
    }
  };

  const getElementLabel = (el: CanvasElement) => {
    if (el.title) return el.title;
    if (el.text) {
      const clean = el.text.split('\n')[0].trim();
      return clean.length > 20 ? clean.substring(0, 20) + '...' : clean;
    }
    return `${el.type.charAt(0).toUpperCase() + el.type.slice(1)} #${el.id.slice(-4)}`;
  };

  return (
    <aside className="absolute right-5 top-20 z-30 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-workspace-200 shadow-panel p-3.5 flex flex-col space-y-3 max-h-[calc(100vh-140px)] select-none animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-workspace-100">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-primary-600" />
          <h3 className="text-xs font-bold text-workspace-900 uppercase tracking-wider">
            Layers ({elements.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-workspace-400 hover:text-workspace-700 rounded-lg hover:bg-workspace-100"
          title="Close Layers Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar max-h-96 pr-1">
        {sortedElements.length === 0 ? (
          <div className="text-center py-8 text-xs text-workspace-400">
            No objects on canvas
          </div>
        ) : (
          sortedElements.map((el) => {
            const isSelected = selectedIds.includes(el.id);
            return (
              <div
                key={el.id}
                onClick={(e) => onSelectElement(el.id, e.shiftKey || e.ctrlKey || e.metaKey)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-primary-50 text-primary-900 border-primary-200 font-semibold'
                    : 'bg-white hover:bg-workspace-50 text-workspace-700 border-transparent hover:border-workspace-200'
                }`}
              >
                {/* Element Type Icon & Title */}
                <div className="flex items-center space-x-2 truncate flex-1 mr-2">
                  {getElementIcon(el.type)}
                  <span className="truncate">{getElementLabel(el)}</span>
                </div>

                {/* Layer Control Icons */}
                <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { isHidden: !el.isHidden });
                    }}
                    className={`p-1 rounded hover:bg-workspace-200 ${
                      el.isHidden ? 'text-rose-500' : 'text-workspace-500'
                    }`}
                    title={el.isHidden ? 'Show Layer' : 'Hide Layer'}
                  >
                    {el.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {/* Lock Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { isLocked: !el.isLocked });
                    }}
                    className={`p-1 rounded hover:bg-workspace-200 ${
                      el.isLocked ? 'text-amber-600' : 'text-workspace-500'
                    }`}
                    title={el.isLocked ? 'Unlock Layer' : 'Lock Layer'}
                  >
                    {el.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Delete Layer */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElements([el.id]);
                    }}
                    className="p-1 rounded hover:bg-rose-50 text-workspace-400 hover:text-rose-600"
                    title="Delete Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Layer Sorting Shortcuts */}
      {selectedIds.length > 0 && (
        <div className="pt-2 border-t border-workspace-100 flex items-center justify-between text-xs">
          <span className="text-workspace-500 font-medium">Reorder</span>
          <div className="flex space-x-1">
            <button
              onClick={() => onBringToFront(selectedIds)}
              className="px-2 py-1 bg-workspace-100 hover:bg-workspace-200 rounded font-medium flex items-center space-x-1 text-workspace-700"
              title="Bring selected to front"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Top</span>
            </button>
            <button
              onClick={() => onSendToBack(selectedIds)}
              className="px-2 py-1 bg-workspace-100 hover:bg-workspace-200 rounded font-medium flex items-center space-x-1 text-workspace-700"
              title="Send selected to back"
            >
              <ArrowDown className="w-3 h-3" />
              <span>Bottom</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
