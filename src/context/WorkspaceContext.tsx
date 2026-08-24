import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { DocumentSummary, Block, MOCK_DOCUMENTS, MOCK_INITIAL_BLOCKS } from '../data/mockData';

export type CanvasItem = {
  id: string;
  type: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  text?: string;
  color?: string;
};

const DEFAULT_CANVAS_ITEMS: CanvasItem[] = [
  { id: 'c1', type: 'sticky', x: 200, y: 150, color: 'bg-yellow-100', text: 'Define CRDT Schema' },
  { id: 'c2', type: 'rect', x: 450, y: 120, w: 200, h: 100, text: 'API Gateway' },
  { id: 'c3', type: 'rect', x: 750, y: 120, w: 200, h: 100, text: 'Sync Service (Node.js)' },
  { id: 'c4', type: 'circle', x: 800, y: 300, r: 100, text: 'MongoDB' },
];

export type WorkspaceContextType = {
  documents: Record<string, DocumentSummary>;
  blocks: Record<string, Block[]>;
  canvasItems: Record<string, CanvasItem[]>;
  createDocument: () => string;
  deleteDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateDocumentTitle: (id: string, title: string) => void;
  updateBlock: (docId: string, blockId: string, content: string) => void;
  addBlock: (docId: string, type: Block['type'], afterBlockId: string) => void;
  deleteBlock: (docId: string, blockId: string) => void;
  toggleChecklist: (docId: string, blockId: string) => void;
  updateCanvasItem: (docId: string, item: CanvasItem) => void;
  addCanvasItem: (docId: string, item: Omit<CanvasItem, 'id'>) => void;
  deleteCanvasItem: (docId: string, itemId: string) => void;
  resetData: () => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, DocumentSummary>>({});
  const [blocks, setBlocks] = useState<Record<string, Block[]>>({});
  const [canvasItems, setCanvasItems] = useState<Record<string, CanvasItem[]>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedDocs = localStorage.getItem('syncspace_docs');
    const savedBlocks = localStorage.getItem('syncspace_blocks');
    const savedCanvas = localStorage.getItem('syncspace_canvas');

    if (savedDocs && savedBlocks && savedCanvas) {
      setDocuments(JSON.parse(savedDocs));
      setBlocks(JSON.parse(savedBlocks));
      setCanvasItems(JSON.parse(savedCanvas));
    } else {
      // Initialize with mock data
      const initialDocs: Record<string, DocumentSummary> = {};
      MOCK_DOCUMENTS.forEach(d => { initialDocs[d.id] = { ...d, isDeleted: false } as any; });
      setDocuments(initialDocs);

      const initialBlocks: Record<string, Block[]> = {};
      MOCK_DOCUMENTS.forEach(d => { initialBlocks[d.id] = [...MOCK_INITIAL_BLOCKS]; });
      setBlocks(initialBlocks);

      const initialCanvas: Record<string, CanvasItem[]> = {};
      MOCK_DOCUMENTS.forEach(d => { initialCanvas[d.id] = [...DEFAULT_CANVAS_ITEMS]; });
      setCanvasItems(initialCanvas);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('syncspace_docs', JSON.stringify(documents));
      localStorage.setItem('syncspace_blocks', JSON.stringify(blocks));
      localStorage.setItem('syncspace_canvas', JSON.stringify(canvasItems));
    }
  }, [documents, blocks, canvasItems, isLoaded]);

  const createDocument = () => {
    const newId = 'doc-' + generateId();
    const newDoc: DocumentSummary = {
      id: newId,
      title: 'Untitled Document',
      updatedAt: 'Just now',
      isFavorite: false,
      authorId: 'u1',
    };
    
    setDocuments(prev => ({ ...prev, [newId]: newDoc }));
    setBlocks(prev => ({ ...prev, [newId]: [{ id: 'b-' + generateId(), type: 'paragraph', content: '' }] }));
    setCanvasItems(prev => ({ ...prev, [newId]: [] }));
    return newId;
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => ({ ...prev, [id]: { ...prev[id], isDeleted: true } as any }));
  };

  const toggleFavorite = (id: string) => {
    setDocuments(prev => ({ ...prev, [id]: { ...prev[id], isFavorite: !prev[id].isFavorite } }));
  };

  const updateDocumentTitle = (id: string, title: string) => {
    setDocuments(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], title, updatedAt: 'Just now' } };
    });
  };

  const updateBlock = (docId: string, blockId: string, content: string) => {
    setBlocks(prev => {
      if (!prev[docId]) return prev;
      const updatedBlocks = prev[docId].map(b => b.id === blockId ? { ...b, content } : b);
      return { ...prev, [docId]: updatedBlocks };
    });
    setDocuments(prev => ({ ...prev, [docId]: { ...prev[docId], updatedAt: 'Just now' } }));
  };

  const addBlock = (docId: string, type: Block['type'], afterBlockId: string) => {
    setBlocks(prev => {
      if (!prev[docId]) return prev;
      const index = prev[docId].findIndex(b => b.id === afterBlockId);
      const newBlock: Block = { id: 'b-' + generateId(), type, content: '' };
      const newBlocks = [...prev[docId]];
      newBlocks.splice(index + 1, 0, newBlock);
      return { ...prev, [docId]: newBlocks };
    });
  };

  const deleteBlock = (docId: string, blockId: string) => {
    setBlocks(prev => {
      if (!prev[docId]) return prev;
      if (prev[docId].length === 1) return prev; // Keep at least one block
      const newBlocks = prev[docId].filter(b => b.id !== blockId);
      return { ...prev, [docId]: newBlocks };
    });
  };

  const toggleChecklist = (docId: string, blockId: string) => {
    setBlocks(prev => {
      if (!prev[docId]) return prev;
      const updatedBlocks = prev[docId].map(b => b.id === blockId ? { ...b, checked: !b.checked } : b);
      return { ...prev, [docId]: updatedBlocks };
    });
  };

  const updateCanvasItem = (docId: string, item: CanvasItem) => {
    setCanvasItems(prev => {
      if (!prev[docId]) return prev;
      const updatedItems = prev[docId].map(i => i.id === item.id ? item : i);
      return { ...prev, [docId]: updatedItems };
    });
    setDocuments(prev => ({ ...prev, [docId]: { ...prev[docId], updatedAt: 'Just now' } }));
  };

  const addCanvasItem = (docId: string, item: Omit<CanvasItem, 'id'>) => {
    setCanvasItems(prev => {
      const items = prev[docId] || [];
      return { ...prev, [docId]: [...items, { ...item, id: 'c-' + generateId() }] };
    });
  };

  const deleteCanvasItem = (docId: string, itemId: string) => {
    setCanvasItems(prev => {
      if (!prev[docId]) return prev;
      return { ...prev, [docId]: prev[docId].filter(i => i.id !== itemId) };
    });
  };

  const resetData = () => {
    localStorage.removeItem('syncspace_docs');
    localStorage.removeItem('syncspace_blocks');
    localStorage.removeItem('syncspace_canvas');
    window.location.href = '/';
  };

  if (!isLoaded) return null;

  return (
    <WorkspaceContext.Provider value={{
      documents,
      blocks,
      canvasItems,
      createDocument,
      deleteDocument,
      toggleFavorite,
      updateDocumentTitle,
      updateBlock,
      addBlock,
      deleteBlock,
      toggleChecklist,
      updateCanvasItem,
      addCanvasItem,
      deleteCanvasItem,
      resetData
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
