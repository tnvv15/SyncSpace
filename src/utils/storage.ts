import { DocumentSummary, Block } from '../data/mockData';
import { CanvasItem } from '../context/WorkspaceContext';

const STORAGE_KEYS = {
  DOCS: 'syncspace_docs',
  BLOCKS: 'syncspace_blocks',
  CANVAS: 'syncspace_canvas'
};

export const storage = {
  loadData: () => {
    try {
      const docsStr = localStorage.getItem(STORAGE_KEYS.DOCS);
      const blocksStr = localStorage.getItem(STORAGE_KEYS.BLOCKS);
      const canvasStr = localStorage.getItem(STORAGE_KEYS.CANVAS);

      if (docsStr && blocksStr && canvasStr) {
        return {
          documents: JSON.parse(docsStr) as Record<string, DocumentSummary>,
          blocks: JSON.parse(blocksStr) as Record<string, Block[]>,
          canvasItems: JSON.parse(canvasStr) as Record<string, CanvasItem[]>
        };
      }
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
    }
    return null;
  },

  saveData: (
    documents: Record<string, DocumentSummary>,
    blocks: Record<string, Block[]>,
    canvasItems: Record<string, CanvasItem[]>
  ) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
      localStorage.setItem(STORAGE_KEYS.BLOCKS, JSON.stringify(blocks));
      localStorage.setItem(STORAGE_KEYS.CANVAS, JSON.stringify(canvasItems));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKS);
    localStorage.removeItem(STORAGE_KEYS.CANVAS);
  }
};
