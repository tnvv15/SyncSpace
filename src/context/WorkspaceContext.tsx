import React, { createContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { DocumentMeta, SyncStatus, UserPresence } from '../types/dashboard';
import { useAuth } from '../auth/AuthContext';
import {
  listDocumentsApi,
  createDocumentApi,
  updateDocumentApi,
  deleteDocumentApi,
} from '../lib/api/documents';

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
  isLoadingDocuments: boolean;
  createItem: (type: 'canvas' | 'doc' | 'file', title?: string) => Promise<string>;
  uploadFile: (file: File) => Promise<string>;
  moveToTrash: (id: string) => Promise<void>;
  restoreFromTrash: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  updateDocumentTitle: (id: string, title: string) => Promise<void>;
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

const DEFAULT_WS_URL = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:1234';

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Record<string, DocumentMeta>>({});
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SyncStatus>('syncing');
  const [activeUsersByDoc, setActiveUsersByDoc] = useState<Record<string, UserPresence[]>>({});
  const { user } = useAuth();

  // Yjs refs — kept for future real-time content collaboration.
  // These handle canvas/document *content* via IndexedDB and WebSocket.
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const idbRef = useRef<IndexeddbPersistence | null>(null);

  // ─────────────────────────────────────────────────────────────────────
  // Yjs setup — preserved for local-first content persistence.
  // The documents *list/metadata* is now driven by the PostgreSQL API.
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const docName = 'workspace-directory';
    const doc = new Y.Doc();
    ydocRef.current = doc;

    const idbProvider = new IndexeddbPersistence(docName, doc);
    idbRef.current = idbProvider;

    let wsProvider: WebsocketProvider | null = null;
    try {
      wsProvider = new WebsocketProvider(DEFAULT_WS_URL, docName, doc, { connect: true });
      providerRef.current = wsProvider;

      wsProvider.on('status', (event: { status: 'connected' | 'connecting' | 'disconnected' }) => {
        if (event.status === 'connected') setSaveStatus('synced');
        else if (event.status === 'connecting') setSaveStatus('syncing');
        else setSaveStatus('offline');
      });

      if (user) {
        const awareness = wsProvider.awareness;
        awareness.setLocalStateField('user', {
          userId: user.id,
          userName: user.name,
          userColor: '#00667E',
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
      }
    } catch (e) {
      console.warn('WebSocket connection fallback to local-only mode:', e);
      setSaveStatus('offline');
    }

    return () => {
      if (wsProvider) wsProvider.destroy();
      idbProvider.destroy();
      doc.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────────────
  // PostgreSQL: fetch documents whenever the authenticated user changes
  // ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      // User logged out — clear documents
      setDocuments({});
      setIsLoadingDocuments(false);
      setSaveStatus('offline');
      return;
    }

    let cancelled = false;
    setIsLoadingDocuments(true);

    async function loadDocuments() {
      try {
        const docs = await listDocumentsApi(user!.name);
        if (!cancelled) {
          const record: Record<string, DocumentMeta> = {};
          docs.forEach((d) => {
            record[d.id] = d;
          });
          setDocuments(record);
          setSaveStatus('synced');
        }
      } catch (err) {
        console.error('Failed to load documents from API:', err);
        if (!cancelled) setSaveStatus('error');
      } finally {
        if (!cancelled) setIsLoadingDocuments(false);
      }
    }

    loadDocuments();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────
  // createItem — persists to PostgreSQL; returns the DB-assigned UUID.
  // File uploads remain IndexedDB-only (no blob storage in this phase).
  // ─────────────────────────────────────────────────────────────────────
  const createItem = useCallback(async (type: 'canvas' | 'doc' | 'file', title?: string): Promise<string> => {
    if (type === 'file') {
      // File uploads are not persisted to PostgreSQL in this phase.
      // They are handled separately by uploadFile() via IndexedDB.
      return '';
    }

    const userName = user?.name ?? 'Unknown';
    const defaultTitle = type === 'canvas' ? 'Untitled Canvas' : 'Untitled Document';
    const resolvedTitle = title?.trim() || defaultTitle;

    try {
      setSaveStatus('syncing');
      const newDoc = await createDocumentApi(type, resolvedTitle, userName);

      setDocuments((prev) => ({ ...prev, [newDoc.id]: newDoc }));
      setSaveStatus('synced');
      return newDoc.id;
    } catch (err) {
      console.error('Failed to create document:', err);
      setSaveStatus('error');
      throw err;
    }
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────
  // uploadFile — stays IndexedDB-only; not persisted to PostgreSQL yet.
  // ─────────────────────────────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newId = 'file-' + Math.random().toString(36).substr(2, 9);
        const dataUrl = e.target?.result as string;

        const newDoc: DocumentMeta = {
          id: newId,
          title: file.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFavorite: false,
          createdBy: user?.name ?? 'Unknown',
          type: 'file',
          fileData: {
            name: file.name,
            size: file.size,
            mimeType: file.type,
            blobUrl: dataUrl,
          },
        };

        setDocuments((prev) => ({ ...prev, [newId]: newDoc }));
        resolve(newId);
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────
  // CRUD operations — each syncs to PostgreSQL, then updates local state.
  // ─────────────────────────────────────────────────────────────────────

  const updateDocumentTitle = useCallback(async (id: string, title: string): Promise<void> => {
    const existing = documents[id];
    if (!existing) return;

    // Optimistic update
    setDocuments((prev) => ({
      ...prev,
      [id]: { ...existing, title, updatedAt: Date.now(), lastModifiedBy: { name: user?.name ?? '', id: user?.id ?? '' } },
    }));

    try {
      if (existing.type !== 'file') {
        await updateDocumentApi(id, { title }, user?.name ?? '');
      }
    } catch (err) {
      console.error('Failed to update document title:', err);
      // Rollback on error
      setDocuments((prev) => ({ ...prev, [id]: existing }));
    }
  }, [documents, user]);

  const toggleFavorite = useCallback(async (id: string): Promise<void> => {
    const existing = documents[id];
    if (!existing) return;

    const newFavorite = !existing.isFavorite;

    // Optimistic update
    setDocuments((prev) => ({
      ...prev,
      [id]: { ...existing, isFavorite: newFavorite, updatedAt: Date.now() },
    }));

    try {
      if (existing.type !== 'file') {
        await updateDocumentApi(id, { isFavorite: newFavorite }, user?.name ?? '');
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      // Rollback
      setDocuments((prev) => ({ ...prev, [id]: existing }));
    }
  }, [documents, user]);

  const moveToTrash = useCallback(async (id: string): Promise<void> => {
    const existing = documents[id];
    if (!existing) return;

    const now = Date.now();

    // Optimistic update
    setDocuments((prev) => ({
      ...prev,
      [id]: { ...existing, isDeleted: true, deletedAt: now, updatedAt: now },
    }));

    try {
      if (existing.type !== 'file') {
        await updateDocumentApi(
          id,
          { isDeleted: true, deletedAt: new Date(now).toISOString() },
          user?.name ?? ''
        );
      }
    } catch (err) {
      console.error('Failed to move to trash:', err);
      // Rollback
      setDocuments((prev) => ({ ...prev, [id]: existing }));
    }
  }, [documents, user]);

  const deleteDocument = useCallback(async (id: string): Promise<void> => {
    await moveToTrash(id);
  }, [moveToTrash]);

  const restoreFromTrash = useCallback(async (id: string): Promise<void> => {
    const existing = documents[id];
    if (!existing) return;

    // Optimistic update
    const restored = { ...existing, isDeleted: false, updatedAt: Date.now() };
    delete restored.deletedAt;
    setDocuments((prev) => ({ ...prev, [id]: restored }));

    try {
      if (existing.type !== 'file') {
        await updateDocumentApi(id, { isDeleted: false }, user?.name ?? '');
      }
    } catch (err) {
      console.error('Failed to restore from trash:', err);
      // Rollback
      setDocuments((prev) => ({ ...prev, [id]: existing }));
    }
  }, [documents, user]);

  const permanentlyDelete = useCallback(async (id: string): Promise<void> => {
    const existing = documents[id];
    if (!existing) return;

    // Optimistic update
    setDocuments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      if (existing.type !== 'file') {
        await deleteDocumentApi(id);
      }
    } catch (err) {
      console.error('Failed to permanently delete:', err);
      // Rollback
      setDocuments((prev) => ({ ...prev, [id]: existing }));
    }
  }, [documents]);

  const emptyTrash = useCallback(async (): Promise<void> => {
    const deletedIds = Object.keys(documents).filter((id) => documents[id].isDeleted);

    // Optimistic update — remove all from state
    setDocuments((prev) => {
      const next = { ...prev };
      deletedIds.forEach((id) => delete next[id]);
      return next;
    });

    // Persist each deletion
    const failures: string[] = [];
    await Promise.all(
      deletedIds.map(async (id) => {
        try {
          if (documents[id].type !== 'file') {
            await deleteDocumentApi(id);
          }
        } catch (err) {
          console.error(`Failed to permanently delete ${id}:`, err);
          failures.push(id);
        }
      })
    );

    // Rollback failed deletions
    if (failures.length > 0) {
      setDocuments((prev) => {
        const next = { ...prev };
        failures.forEach((id) => {
          if (documents[id]) next[id] = documents[id];
        });
        return next;
      });
    }
  }, [documents]);

  return (
    <WorkspaceContext.Provider
      value={{
        documents,
        isLoadingDocuments,
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
        updateBlock: () => {},
        toggleChecklist: () => {},
        addBlock: () => {},
        deleteBlock: () => {},
        canvasItems: {},
        updateCanvasItem: () => {},
        deleteCanvasItem: () => {},
        addCanvasItem: () => {},
        setCurrentDocId,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
