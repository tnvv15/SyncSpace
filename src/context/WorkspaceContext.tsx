import React, { createContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { DocumentMeta, SyncStatus, UserPresence } from '../types/dashboard';
import { CURRENT_USER_ID } from '../data/mockData';
import { useAuth } from '../auth/AuthContext';

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

export type WorkspaceContextType = {
  documents: Record<string, DocumentMeta>;
  createItem: (type: 'canvas' | 'doc' | 'file', title?: string) => string;
  uploadFile: (file: File) => Promise<string>;
  moveToTrash: (id: string) => void;
  restoreFromTrash: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  emptyTrash: () => void;
  deleteDocument: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateDocumentTitle: (id: string, title: string) => void;
  saveStatus: SyncStatus;
  activeUsersByDoc: Record<string, UserPresence[]>;

  // Stubbing these for now so we don't break existing destructurings 
  // before the Editor is refactored in a later step.
  blocks?: any;
  updateBlock?: any;
  toggleChecklist?: any;
  addBlock?: any;
  deleteBlock?: any;
  setIsSyncPanelOpen?: any;
  currentDocId?: any;
  canvasItems?: any;
  updateCanvasItem?: any;
  deleteCanvasItem?: any;
  addCanvasItem?: any;
  setCurrentDocId: (id: string | null) => void;
};

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const DEFAULT_WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:1234';
console.log("SYNCSPACE WS URL =", DEFAULT_WS_URL);
console.log("RAW VITE_WS_URL =", (import.meta as any).env?.VITE_WS_URL);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, DocumentMeta>>({});
  const [saveStatus, setSaveStatus] = useState<SyncStatus>('syncing');
  const [activeUsersByDoc, setActiveUsersByDoc] = useState<Record<string, UserPresence[]>>({});
  const { user } = useAuth();

  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const idbRef = useRef<IndexeddbPersistence | null>(null);
  const documentsMapRef = useRef<Y.Map<DocumentMeta> | null>(null);

  useEffect(() => {
    const docName = 'workspace-directory';
    const doc = new Y.Doc();
    ydocRef.current = doc;

    const idbProvider = new IndexeddbPersistence(docName, doc);
    idbRef.current = idbProvider;

    const documentsMap = doc.getMap<DocumentMeta>('documents');
    documentsMapRef.current = documentsMap;

    const updateReactElements = () => {
      const docsRecord: Record<string, DocumentMeta> = {};
      documentsMap.forEach((meta, id) => {
        if (meta && typeof meta === 'object') {
          docsRecord[id] = meta;
        }
      });
      setDocuments(docsRecord);
    };

    idbProvider.on('synced', () => {
      setSaveStatus('synced');
      updateReactElements();
    });

    let wsProvider: WebsocketProvider | null = null;
    try {
      wsProvider = new WebsocketProvider(DEFAULT_WS_URL, docName, doc, { connect: true });
      providerRef.current = wsProvider;

      wsProvider.on('status', (event: { status: 'connected' | 'connecting' | 'disconnected' }) => {
        if (event.status === 'connected') setSaveStatus('synced');
        else if (event.status === 'connecting') setSaveStatus('syncing');
        else setSaveStatus('offline');
      });

      const awareness = wsProvider.awareness;
      awareness.setLocalStateField('user', {
        userId: CURRENT_USER_ID,
        userName: user?.name || 'Tanvi',
        userColor: '#00667E', // In reality, generate random or hash
        currentDocId: null,
        lastActive: Date.now(),
      });

      awareness.on('change', () => {
        const states = awareness.getStates();
        const usersByDoc: Record<string, UserPresence[]> = {};

        states.forEach((state) => {
          if (state.user && state.user.currentDocId) {
            if (!usersByDoc[state.user.currentDocId]) {
              usersByDoc[state.user.currentDocId] = [];
            }
            usersByDoc[state.user.currentDocId].push(state.user as UserPresence);
          }
        });
        setActiveUsersByDoc(usersByDoc);
      });

    } catch (e) {
      console.warn('WebSocket connection fallback to local-only mode:', e);
      setSaveStatus('offline');
    }

    documentsMap.observe(() => {
      updateReactElements();
    });

    updateReactElements();

    return () => {
      if (wsProvider) wsProvider.destroy();
      idbProvider.destroy();
      doc.destroy();
    };
  }, []);

  const setCurrentDocId = useCallback((id: string | null) => {
    if (providerRef.current?.awareness) {
      const awareness = providerRef.current.awareness;
      const localState = awareness.getLocalState();
      if (localState && localState.user) {
        awareness.setLocalStateField('user', {
          ...localState.user,
          currentDocId: id,
          lastActive: Date.now(),
        });
      }
    }
  }, []);

  const createItem = (type: 'canvas' | 'doc' | 'file', title?: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return '';
    const newId = (type === 'canvas' ? 'canvas-' : 'doc-') + generateId();
    const newDoc: DocumentMeta = {
      id: newId,
      title: title || (type === 'canvas' ? 'Untitled Canvas' : 'Untitled Document'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
      createdBy: user?.name || 'Tanvi',
      type,
    };

    ydocRef.current.transact(() => {
      documentsMapRef.current?.set(newId, newDoc);
    });
    return newId;
  };

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!documentsMapRef.current || !ydocRef.current) {
          reject(new Error('CRDT not initialized'));
          return;
        }
        const newId = 'file-' + generateId();
        const dataUrl = e.target?.result as string;

        const newDoc: DocumentMeta = {
          id: newId,
          title: file.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFavorite: false,
          createdBy: user?.name || 'Tanvi',
          type: 'file',
          fileData: {
            name: file.name,
            size: file.size,
            mimeType: file.type,
            blobUrl: dataUrl
          }
        };

        ydocRef.current.transact(() => {
          documentsMapRef.current?.set(newId, newDoc);
        });
        resolve(newId);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const deleteDocument = (id: string) => {
    moveToTrash(id); // Default delete goes to trash now
  };

  const moveToTrash = (id: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    const existing = documentsMapRef.current.get(id);
    if (existing) {
      ydocRef.current.transact(() => {
        documentsMapRef.current?.set(id, { ...existing, isDeleted: true, deletedAt: Date.now(), updatedAt: Date.now() });
      });
    }
  };

  const restoreFromTrash = (id: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    const existing = documentsMapRef.current.get(id);
    if (existing) {
      ydocRef.current.transact(() => {
        const updated = { ...existing, isDeleted: false, updatedAt: Date.now() };
        delete updated.deletedAt;
        documentsMapRef.current?.set(id, updated);
      });
    }
  };

  const permanentlyDelete = (id: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    ydocRef.current.transact(() => {
      documentsMapRef.current?.delete(id);
    });
  };

  const emptyTrash = () => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    ydocRef.current.transact(() => {
      const idsToDelete: string[] = [];
      documentsMapRef.current?.forEach((meta, id) => {
        if (meta.isDeleted) idsToDelete.push(id);
      });
      idsToDelete.forEach(id => documentsMapRef.current?.delete(id));
    });
  };

  const toggleFavorite = (id: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    const existing = documentsMapRef.current.get(id);
    if (existing) {
      ydocRef.current.transact(() => {
        documentsMapRef.current?.set(id, { ...existing, isFavorite: !existing.isFavorite, updatedAt: Date.now() });
      });
    }
  };

  const updateDocumentTitle = (id: string, title: string) => {
    if (!documentsMapRef.current || !ydocRef.current) return;
    const existing = documentsMapRef.current.get(id);
    if (existing) {
      ydocRef.current.transact(() => {
        documentsMapRef.current?.set(id, {
          ...existing,
          title,
          updatedAt: Date.now(),
          lastModifiedBy: { name: user?.name || 'Tanvi', id: CURRENT_USER_ID }
        });
      });
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      documents,
      createItem,
      uploadFile,
      deleteDocument,
      moveToTrash,
      restoreFromTrash,
      permanentlyDelete,
      emptyTrash,
      toggleFavorite,
      updateDocumentTitle,
      saveStatus,
      activeUsersByDoc,

      // Stubs
      blocks: {},
      updateBlock: () => { },
      toggleChecklist: () => { },
      addBlock: () => { },
      deleteBlock: () => { },
      canvasItems: {},
      updateCanvasItem: () => { },
      deleteCanvasItem: () => { },
      addCanvasItem: () => { },
      setCurrentDocId,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
