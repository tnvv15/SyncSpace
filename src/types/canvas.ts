export type ElementType = 'sticky' | 'text' | 'stamp' | 'card' | 'shape';

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
  | 'banner'
  | 'tag'
  | 'polaroid';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // e.g. -2 to +2 deg
  color: PaperColor;
  tapeColor?: string;
  hasTape?: boolean;
  hasStaple?: boolean;
  text?: string;
  title?: string;
  stampType?: StampVariant;
  shapeType?: ShapeVariant;
  authorName?: string;
  authorColor?: string;
  createdAt: number;
  updatedAt: number;
  pinned?: boolean;
  zIndex: number;
}

export interface UserPresence {
  clientId: number;
  name: string;
  color: string;
  cursor: { x: number; y: number } | null;
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
  | 'sticky' 
  | 'text' 
  | 'card' 
  | 'stamp' 
  | 'shape' 
  | 'eraser'
  | 'pan';
