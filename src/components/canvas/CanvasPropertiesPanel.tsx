import React from 'react';
import { 
  CanvasElement, 
  StrokeStyle, 
  LineStyle, 
  TextAlign, 
  FontFamily 
} from '../../types/canvas';
import { CANVAS_PALETTES } from '../../utils/canvasConstants';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  Trash2, 
  Copy, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Lock, 
  Unlock, 
  Group, 
  Ungroup,
  Sliders,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal
} from 'lucide-react';

interface CanvasPropertiesPanelProps {
  selectedElements: CanvasElement[];
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateElements: (updatesMap: Record<string, Partial<CanvasElement>>) => void;
  onDeleteElements: (ids: string[]) => void;
  onDuplicateElements: (ids: string[]) => void;
  onBringToFront: (ids: string[]) => void;
  onSendToBack: (ids: string[]) => void;
  onGroupElements: (ids: string[]) => void;
  onUngroupElements: (ids: string[]) => void;
  onAlignElements: (
    ids: string[], 
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-h' | 'distribute-v'
  ) => void;
}

export const CanvasPropertiesPanel: React.FC<CanvasPropertiesPanelProps> = ({
  selectedElements,
  onUpdateElement,
  onUpdateElements,
  onDeleteElements,
  onDuplicateElements,
  onBringToFront,
  onSendToBack,
  onGroupElements,
  onUngroupElements,
  onAlignElements,
}) => {
  if (selectedElements.length === 0) return null;

  const isMulti = selectedElements.length > 1;
  const primaryElem = selectedElements[0];
  const ids = selectedElements.map((el) => el.id);

  // Helper to bulk update property across all selected elements
  const updateProp = (key: keyof CanvasElement, value: any) => {
    const updates: Record<string, Partial<CanvasElement>> = {};
    selectedElements.forEach((el) => {
      updates[el.id] = { [key]: value };
    });
    onUpdateElements(updates);
  };

  const isConnector = selectedElements.some((el) => el.type === 'arrow' || el.type === 'line');
  const isFreehand = selectedElements.some((el) => el.type === 'draw');
  const hasTextCapability = selectedElements.some(
    (el) => ['text', 'sticky', 'rectangle', 'circle', 'diamond', 'triangle', 'star', 'hexagon', 'cloud', 'arrow'].includes(el.type)
  );
  const isGrouped = selectedElements.every((el) => el.groupId && el.groupId === selectedElements[0].groupId);

  return (
    <aside className="absolute right-5 top-20 z-30 w-72 bg-white/95 backdrop-blur-md rounded-2xl border border-workspace-200 shadow-panel p-4 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar select-none animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-workspace-100">
        <div className="flex items-center space-x-1.5">
          <Sliders className="w-4 h-4 text-primary-600" />
          <h3 className="text-xs font-bold text-workspace-900 uppercase tracking-wider">
            {isMulti ? `${selectedElements.length} Items Selected` : `${primaryElem.type.toUpperCase()} Properties`}
          </h3>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onDuplicateElements(ids)}
            className="p-1 text-workspace-500 hover:text-workspace-900 hover:bg-workspace-100 rounded"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteElements(ids)}
            className="p-1 text-workspace-500 hover:text-rose-600 hover:bg-rose-50 rounded"
            title="Delete (Delete / Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Selection Alignment Bar */}
      {isMulti && (
        <div className="space-y-1.5 bg-workspace-50 p-2.5 rounded-xl border border-workspace-100">
          <span className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Align & Distribute
          </span>
          <div className="grid grid-cols-6 gap-1 pt-1">
            <button
              onClick={() => onAlignElements(ids, 'left')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Left"
            >
              <AlignStartVertical className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlignElements(ids, 'center')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Center Horizontally"
            >
              <AlignCenterVertical className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlignElements(ids, 'right')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Right"
            >
              <AlignEndVertical className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlignElements(ids, 'top')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Top"
            >
              <AlignStartHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlignElements(ids, 'middle')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Middle Vertically"
            >
              <AlignCenterHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onAlignElements(ids, 'bottom')}
              className="p-1.5 bg-white hover:bg-workspace-200 border border-workspace-200 rounded flex items-center justify-center text-workspace-700"
              title="Align Bottom"
            >
              <AlignEndHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 1. Fill Color (Not applicable to pure lines/pencil) */}
      {!isConnector && !isFreehand && (
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider flex justify-between">
            <span>Fill Color</span>
            <span className="text-[10px] text-workspace-400">{primaryElem.fillColor || 'White'}</span>
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {CANVAS_PALETTES.fills.map((fill) => (
              <button
                key={fill.value}
                onClick={() => updateProp('fillColor', fill.value)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-115 ${
                  primaryElem.fillColor === fill.value
                    ? 'border-primary-600 ring-2 ring-primary-400 ring-offset-1 scale-105'
                    : 'border-workspace-300'
                }`}
                style={{ backgroundColor: fill.value === 'transparent' ? '#FFFFFF' : fill.value }}
                title={fill.label}
              >
                {fill.value === 'transparent' && (
                  <span className="text-rose-500 text-xs font-bold">/</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Stroke / Border Color */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider flex justify-between">
          <span>Stroke Color</span>
          <span className="text-[10px] text-workspace-400">{primaryElem.strokeColor || '#1F2937'}</span>
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {CANVAS_PALETTES.strokes.map((stroke) => (
            <button
              key={stroke.value}
              onClick={() => updateProp('strokeColor', stroke.value)}
              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-115 ${
                primaryElem.strokeColor === stroke.value
                  ? 'border-primary-600 ring-2 ring-primary-400 ring-offset-1 scale-105'
                  : 'border-workspace-300'
              }`}
              style={{ backgroundColor: stroke.value }}
              title={stroke.label}
            />
          ))}
        </div>
      </div>

      {/* 3. Stroke Width & Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Stroke Width
          </label>
          <div className="flex bg-workspace-100 p-0.5 rounded-lg border border-workspace-200">
            {[1, 2, 4, 8].map((w) => (
              <button
                key={w}
                onClick={() => updateProp('strokeWidth', w)}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  (primaryElem.strokeWidth || 2) === w
                    ? 'bg-white text-workspace-900 shadow-2xs'
                    : 'text-workspace-500 hover:text-workspace-900'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Stroke Style
          </label>
          <div className="flex bg-workspace-100 p-0.5 rounded-lg border border-workspace-200">
            {(['solid', 'dashed', 'dotted'] as StrokeStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => updateProp('strokeStyle', style)}
                className={`px-2 py-0.5 text-xs font-semibold capitalize rounded ${
                  (primaryElem.strokeStyle || 'solid') === style
                    ? 'bg-white text-workspace-900 shadow-2xs'
                    : 'text-workspace-500 hover:text-workspace-900'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Opacity Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Opacity
          </label>
          <span className="font-semibold text-workspace-700">
            {Math.round((primaryElem.opacity ?? 1) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={primaryElem.opacity ?? 1}
          onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
          className="w-full accent-primary-600 h-1.5 bg-workspace-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* 5. Typography Settings */}
      {hasTextCapability && (
        <div className="space-y-2 pt-2 border-t border-workspace-100">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Typography
          </label>

          <div className="flex items-center justify-between">
            <span className="text-xs text-workspace-600">Font Size</span>
            <div className="flex bg-workspace-100 p-0.5 rounded-lg border border-workspace-200">
              {[12, 14, 18, 24, 32].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateProp('fontSize', sz)}
                  className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                    (primaryElem.fontSize || 14) === sz
                      ? 'bg-white text-workspace-900 shadow-2xs'
                      : 'text-workspace-500 hover:text-workspace-900'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex bg-workspace-100 p-0.5 rounded-lg border border-workspace-200 space-x-0.5">
              <button
                onClick={() =>
                  updateProp('fontWeight', primaryElem.fontWeight === 'bold' ? 'normal' : 'bold')
                }
                className={`p-1 rounded ${
                  primaryElem.fontWeight === 'bold' ? 'bg-white text-workspace-900 shadow-2xs' : 'text-workspace-500'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  updateProp('fontStyle', primaryElem.fontStyle === 'italic' ? 'normal' : 'italic')
                }
                className={`p-1 rounded ${
                  primaryElem.fontStyle === 'italic' ? 'bg-white text-workspace-900 shadow-2xs' : 'text-workspace-500'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  updateProp(
                    'textDecoration',
                    primaryElem.textDecoration === 'underline' ? 'none' : 'underline'
                  )
                }
                className={`p-1 rounded ${
                  primaryElem.textDecoration === 'underline'
                    ? 'bg-white text-workspace-900 shadow-2xs'
                    : 'text-workspace-500'
                }`}
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex bg-workspace-100 p-0.5 rounded-lg border border-workspace-200 space-x-0.5">
              {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
                <button
                  key={align}
                  onClick={() => updateProp('textAlign', align)}
                  className={`p-1 rounded ${
                    (primaryElem.textAlign || 'center') === align
                      ? 'bg-white text-workspace-900 shadow-2xs'
                      : 'text-workspace-500'
                  }`}
                  title={`Align ${align}`}
                >
                  {align === 'left' ? (
                    <AlignLeft className="w-3.5 h-3.5" />
                  ) : align === 'center' ? (
                    <AlignCenter className="w-3.5 h-3.5" />
                  ) : (
                    <AlignRight className="w-3.5 h-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Connector Line Style */}
      {isConnector && (
        <div className="space-y-2 pt-2 border-t border-workspace-100">
          <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
            Connector Style
          </label>
          <div className="grid grid-cols-3 gap-1 bg-workspace-100 p-0.5 rounded-lg border border-workspace-200 text-xs">
            {(['straight', 'elbow', 'curved'] as LineStyle[]).map((ls) => (
              <button
                key={ls}
                onClick={() => updateProp('lineStyle', ls)}
                className={`py-1 font-semibold capitalize rounded ${
                  (primaryElem.lineStyle || 'straight') === ls
                    ? 'bg-white text-workspace-900 shadow-2xs'
                    : 'text-workspace-500'
                }`}
              >
                {ls}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={primaryElem.endArrow !== false}
                onChange={(e) => updateProp('endArrow', e.target.checked)}
                className="accent-primary-600 rounded"
              />
              <span className="text-workspace-700">End Arrow</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!primaryElem.startArrow}
                onChange={(e) => updateProp('startArrow', e.target.checked)}
                className="accent-primary-600 rounded"
              />
              <span className="text-workspace-700">Start Arrow</span>
            </label>
          </div>
        </div>
      )}

      {/* 7. Layer Depth & Grouping */}
      <div className="pt-2 border-t border-workspace-100 space-y-2">
        <label className="text-[11px] font-bold text-workspace-500 uppercase tracking-wider">
          Arrange & Group
        </label>
        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={() => onBringToFront(ids)}
            className="px-2.5 py-1.5 bg-workspace-50 hover:bg-workspace-100 border border-workspace-200 rounded-lg text-workspace-700 font-medium flex items-center justify-center space-x-1 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-primary-600" />
            <span>Bring to Front</span>
          </button>
          <button
            onClick={() => onSendToBack(ids)}
            className="px-2.5 py-1.5 bg-workspace-50 hover:bg-workspace-100 border border-workspace-200 rounded-lg text-workspace-700 font-medium flex items-center justify-center space-x-1 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 text-workspace-500" />
            <span>Send to Back</span>
          </button>

          {isMulti && (
            <button
              onClick={() => (isGrouped ? onUngroupElements(ids) : onGroupElements(ids))}
              className="col-span-2 px-2.5 py-1.5 bg-workspace-50 hover:bg-workspace-100 border border-workspace-200 rounded-lg text-workspace-700 font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              {isGrouped ? (
                <>
                  <Ungroup className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ungroup Selection</span>
                </>
              ) : (
                <>
                  <Group className="w-3.5 h-3.5 text-primary-600" />
                  <span>Group Selection</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
