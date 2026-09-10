export type ElementType = 
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'hexagon'
  | 'cloud'
  | 'sticky'
  | 'text'
  | 'image'
  | 'line'
  | 'arrow'
  | 'draw'
  | 'stamp'
  | 'card'
  | 'shape';

export type PaperColor = 
  | 'sunflower'
  | 'coral'
  | 'sage'
  | 'sky'
  | 'violet'
  | 'kraft'
  | 'cream'
  | 'rose';

export type StampVariant = 
  | 'APPROVED'
  | 'DRAFT'
  | 'URGENT'
  | 'IDEA'
  | 'REVIEW'
  | 'COMPLETED'
  | 'PRIORITY'
  | 'CONFIDENTIAL';

export type ShapeVariant = 
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'hexagon'
  | 'cloud'
  | 'banner'
  | 'tag'
  | 'polaroid';

export type StrokeStyle = 'solid' | 'dashed' | 'dotted';
export type LineStyle = 'straight' | 'elbow' | 'curved';
export type TextAlign = 'left' | 'center' | 'right';
export type FontFamily = 'sans' | 'serif' | 'mono' | 'handwriting';

export interface Point {
  x: number;
  y: number;
}

export interface ConnectorBinding {
  elementId: string;
  side?: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees e.g. 0
  zIndex: number;
  color: PaperColor;
  
  // Text & Content
  text?: string;
  title?: string;
  label?: string;
  
  // Shape Styling
  fillColor?: string; // hex or 'transparent'
  strokeColor?: string; // hex
  strokeWidth?: number; // 1, 2, 4, 8
  strokeStyle?: StrokeStyle;
  opacity?: number; // 0 to 1
  borderRadius?: number; // e.g. 8 for rect
  
  // Typography
  fontSize?: number; // 12, 14, 16, 20, 24, 32, 48
  fontFamily?: FontFamily;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: TextAlign;
  textColor?: string;
  
  // Sticky & Craft compatibility
  tapeColor?: string;
  hasTape?: boolean;
  hasStaple?: boolean;
  stampType?: StampVariant;
  shapeType?: ShapeVariant;
  authorName?: string;
  authorColor?: string;
  
  // Connectors (Arrow / Line)
  startPoint?: Point;
  endPoint?: Point;
  startArrow?: boolean;
  endArrow?: boolean;
  lineStyle?: LineStyle;
  startBinding?: ConnectorBinding;
  endBinding?: ConnectorBinding;
  
  // Freehand Drawing (Pencil)
  points?: Point[];
  
  // Image
  imageUrl?: string;
  aspectRatio?: number;
  
  // Organization
  isLocked?: boolean;
  isHidden?: boolean;
  groupId?: string;
  pinned?: boolean;
  
  createdAt: number;
  updatedAt: number;
}

export interface UserPresence {
  clientId: number;
  name: string;
  color: string;
  avatarUrl?: string;
  cursor: { x: number; y: number } | null;
  selectedIds?: string[];
  activeElementId?: string | null;
  lastActive: number;
  tool?: string;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export type ActiveTool = 
  | 'select' 
  | 'pan' 
  | 'arrow' 
  | 'line' 
  | 'rectangle' 
  | 'circle' 
  | 'diamond' 
  | 'draw' 
  | 'text' 
  | 'sticky' 
  | 'image' 
  | 'eraser' 
  | 'triangle' 
  | 'star' 
  | 'hexagon' 
  | 'cloud'
  | 'stamp'
  | 'card'
  | 'shape';
