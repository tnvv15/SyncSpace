import { CanvasElement, Point, ConnectorBinding } from '../types/canvas';

/**
 * Get anchor point for a shape given its position and dimension and side
 */
export function getShapeAnchorPoint(
  shape: CanvasElement,
  side?: 'top' | 'right' | 'bottom' | 'left' | 'center'
): Point {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;

  switch (side) {
    case 'top':
      return { x: cx, y: shape.y };
    case 'bottom':
      return { x: cx, y: shape.y + shape.height };
    case 'left':
      return { x: shape.x, y: cy };
    case 'right':
      return { x: shape.x + shape.width, y: cy };
    case 'center':
    default:
      return { x: cx, y: cy };
  }
}

/**
 * Find the closest side on a target shape from a given source point
 */
export function getClosestAnchorSide(shape: CanvasElement, fromPoint: Point): 'top' | 'right' | 'bottom' | 'left' {
  const anchors: { side: 'top' | 'right' | 'bottom' | 'left'; pt: Point }[] = [
    { side: 'top', pt: { x: shape.x + shape.width / 2, y: shape.y } },
    { side: 'bottom', pt: { x: shape.x + shape.width / 2, y: shape.y + shape.height } },
    { side: 'left', pt: { x: shape.x, y: shape.y + shape.height / 2 } },
    { side: 'right', pt: { x: shape.x + shape.width, y: shape.y + shape.height / 2 } },
  ];

  let bestSide: 'top' | 'right' | 'bottom' | 'left' = 'top';
  let bestDist = Infinity;

  anchors.forEach(({ side, pt }) => {
    const dist = Math.hypot(pt.x - fromPoint.x, pt.y - fromPoint.y);
    if (dist < bestDist) {
      bestDist = dist;
      bestSide = side;
    }
  });

  return bestSide;
}

/**
 * Resolve start and end coordinates for an arrow or line
 */
export function resolveConnectorPoints(
  connector: CanvasElement,
  elementsMap: Map<string, CanvasElement> | Record<string, CanvasElement>
): { start: Point; end: Point } {
  const getElem = (id: string): CanvasElement | undefined => {
    if (elementsMap instanceof Map) return elementsMap.get(id);
    return elementsMap[id];
  };

  let start: Point = connector.startPoint || { x: connector.x, y: connector.y };
  let end: Point = connector.endPoint || { x: connector.x + connector.width, y: connector.y + connector.height };

  if (connector.startBinding?.elementId) {
    const startElem = getElem(connector.startBinding.elementId);
    if (startElem) {
      const side = connector.startBinding.side || getClosestAnchorSide(startElem, end);
      start = getShapeAnchorPoint(startElem, side);
    }
  }

  if (connector.endBinding?.elementId) {
    const endElem = getElem(connector.endBinding.elementId);
    if (endElem) {
      const side = connector.endBinding.side || getClosestAnchorSide(endElem, start);
      end = getShapeAnchorPoint(endElem, side);
    }
  }

  return { start, end };
}

/**
 * Generate SVG Path string for connectors (straight, curved, elbow)
 */
export function generateConnectorPath(
  start: Point,
  end: Point,
  style: 'straight' | 'curved' | 'elbow' = 'straight'
): string {
  if (style === 'straight') {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  if (style === 'curved') {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    // Bezier control points with smooth gentle curve
    const cx1 = start.x + dx * 0.5;
    const cy1 = start.y;
    const cx2 = start.x + dx * 0.5;
    const cy2 = end.y;
    return `M ${start.x} ${start.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${end.x} ${end.y}`;
  }

  if (style === 'elbow') {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  }

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

/**
 * Generate smooth SVG path from freehand drawing points
 */
export function generateSmoothFreehandPath(points: Point[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} A 1 1 0 0 0 ${points[0].x + 0.1} ${points[0].y + 0.1}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

/**
 * Calculate multi-element bounding box
 */
export function calculateElementsBounds(elements: CanvasElement[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} | null {
  if (!elements || elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  elements.forEach((el) => {
    if (el.type === 'line' || el.type === 'arrow') {
      const p1 = el.startPoint || { x: el.x, y: el.y };
      const p2 = el.endPoint || { x: el.x + el.width, y: el.y + el.height };
      minX = Math.min(minX, p1.x, p2.x);
      minY = Math.min(minY, p1.y, p2.y);
      maxX = Math.max(maxX, p1.x, p2.x);
      maxY = Math.max(maxY, p1.y, p2.y);
    } else if (el.type === 'draw' && el.points && el.points.length > 0) {
      el.points.forEach((pt) => {
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      });
    } else {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    }
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Check if a point is inside a rectangle
 */
export function isPointInRect(pt: Point, rect: { x: number; y: number; width: number; height: number }): boolean {
  return pt.x >= rect.x && pt.x <= rect.x + rect.width && pt.y >= rect.y && pt.y <= rect.y + rect.height;
}

/**
 * Check if two rectangles intersect
 */
export function doRectsIntersect(
  r1: { minX: number; minY: number; maxX: number; maxY: number },
  r2: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  return !(r2.minX > r1.maxX || r2.maxX < r1.minX || r2.minY > r1.maxY || r2.maxY < r1.minY);
}
