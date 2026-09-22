import { useState, useEffect, useRef, useCallback } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebsocketProvider } from 'y-websocket';
import { DocumentBlock, BlockType } from '../types/documentTheme';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface UseDocumentYjsOptions {
  documentId: string;
  wsUrl?: string;
}

export interface UseDocumentYjsReturn {
  blocks: DocumentBlock[];
  updateBlock: (
    id: string,
    updates: Partial<DocumentBlock> | string,
    extra?: Partial<DocumentBlock>
  ) => void;
  addBlock: (
    typeOrBlock?: BlockType | Partial<DocumentBlock>,
    afterId?: string
  ) => string;
  deleteBlock: (id: string) => void;
  toggleChecklist: (id: string) => void;
  connectionStatus: ConnectionStatus;
  isIndexedDbSynced: boolean;
  clientId: number;
}

const DEFAULT_WS_URL =
  (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:1234';

function generateBlockId(): string {
  return `b_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
}

function findBlockIndex(arr: Y.Array<DocumentBlock>, id: string): number {
  for (let i = 0; i < arr.length; i++) {
    const b = arr.get(i);
    if (b && b.id === id) {
      return i;
    }
  }
  return -1;
}

export function useDocumentYjs({
  documentId,
  wsUrl = DEFAULT_WS_URL,
}: UseDocumentYjsOptions): UseDocumentYjsReturn {
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting');
  const [isIndexedDbSynced, setIsIndexedDbSynced] = useState(false);
  const [clientId, setClientId] = useState<number>(0);

  const ydocRef = useRef<Y.Doc | null>(null);
  const blocksArrayRef = useRef<Y.Array<DocumentBlock> | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const idbRef = useRef<IndexeddbPersistence | null>(null);

  useEffect(() => {
    // Graceful handling for missing or blank document ID
    if (!documentId || !documentId.trim()) {
      setBlocks([]);
      setConnectionStatus('disconnected');
      setIsIndexedDbSynced(false);
      return;
    }

    const docName = `syncspace-document-${documentId.trim()}`;
    const doc = new Y.Doc();
    ydocRef.current = doc;
    setClientId(doc.clientID);

    const blocksArray = doc.getArray<DocumentBlock>('blocks');
    blocksArrayRef.current = blocksArray;

    const syncBlocksFromYjs = () => {
      const currentArray = blocksArrayRef.current;
      if (!currentArray) return;
      setBlocks(currentArray.toArray());
    };

    let hasInitialized = false;

    // Checks if the document is genuinely empty and initializes starter paragraph once
    const checkAndInitDefaultBlocks = () => {
      if (hasInitialized) return;
      const currentArray = blocksArrayRef.current;
      const currentDoc = ydocRef.current;
      if (!currentArray || !currentDoc) return;

      if (currentArray.length === 0) {
        hasInitialized = true;
        currentDoc.transact(() => {
          if (currentArray.length === 0) {
            currentArray.push([
              {
                id: 'b1',
                type: 'paragraph',
                content: '',
                checked: false,
              },
            ]);
          }
        });
      } else {
        hasInitialized = true;
        // If concurrent initializations occurred, deduplicate initial empty b1 blocks
        if (currentArray.length > 1) {
          const b1Indices: number[] = [];
          for (let i = 0; i < currentArray.length; i++) {
            const item = currentArray.get(i);
            if (item && item.id === 'b1' && item.content === '') {
              b1Indices.push(i);
            }
          }
          if (b1Indices.length > 1) {
            currentDoc.transact(() => {
              for (let i = b1Indices.length - 1; i > 0; i--) {
                currentArray.delete(b1Indices[i], 1);
              }
            });
          }
        }
      }
    };

    // 1. IndexedDB persistence for offline-first resilience
    const idbProvider = new IndexeddbPersistence(docName, doc);
    idbRef.current = idbProvider;

    idbProvider.on('synced', () => {
      setIsIndexedDbSynced(true);
      checkAndInitDefaultBlocks();
      syncBlocksFromYjs();
    });

    // 2. Real-time WebSocket synchronization across tabs and users
    let wsProvider: WebsocketProvider | null = null;
    try {
      wsProvider = new WebsocketProvider(wsUrl, docName, doc, {
        connect: true,
      });
      providerRef.current = wsProvider;

      wsProvider.on('status', (event: { status: ConnectionStatus }) => {
        setConnectionStatus(event.status);
      });

      wsProvider.on('sync', (isSynced: boolean) => {
        if (isSynced) {
          checkAndInitDefaultBlocks();
          syncBlocksFromYjs();
        }
      });
    } catch (e) {
      console.warn(
        `[useDocumentYjs] WebSocket initialization fallback to offline IndexedDB for ${docName}:`,
        e
      );
      setConnectionStatus('disconnected');
    }

    // 3. Observe Y.Array mutations (local, remote, or storage hydration)
    const handleArrayChange = () => {
      syncBlocksFromYjs();
    };

    blocksArray.observe(handleArrayChange);

    // Initial sync
    syncBlocksFromYjs();

    // 4. Cleanup on document change or unmount
    return () => {
      blocksArray.unobserve(handleArrayChange);
      if (wsProvider) {
        wsProvider.destroy();
      }
      idbProvider.destroy();
      doc.destroy();
      ydocRef.current = null;
      blocksArrayRef.current = null;
      providerRef.current = null;
      idbRef.current = null;
    };
  }, [documentId, wsUrl]);

  // Update a block in Y.Doc
  const updateBlock = useCallback(
    (
      id: string,
      updates: Partial<DocumentBlock> | string,
      extra?: Partial<DocumentBlock>
    ) => {
      const currentArray = blocksArrayRef.current;
      const currentDoc = ydocRef.current;
      if (!currentArray || !currentDoc) return;

      const patch: Partial<DocumentBlock> =
        typeof updates === 'string'
          ? { content: updates, ...extra }
          : { ...updates, ...extra };

      const idx = findBlockIndex(currentArray, id);
      if (idx === -1) return;

      const current = currentArray.get(idx);
      if (!current) return;

      // Avoid unnecessary duplicate transactions if content/properties are identical
      const hasChanges = Object.entries(patch).some(
        ([key, value]) => (current as any)[key] !== value
      );
      if (!hasChanges) return;

      const updated: DocumentBlock = {
        ...current,
        ...patch,
      };

      currentDoc.transact(() => {
        currentArray.delete(idx, 1);
        currentArray.insert(idx, [updated]);
      });
    },
    []
  );

  // Add a new block in Y.Doc (at end or after a specific block)
  const addBlock = useCallback(
    (
      typeOrBlock?: BlockType | Partial<DocumentBlock>,
      afterId?: string
    ): string => {
      const currentArray = blocksArrayRef.current;
      const currentDoc = ydocRef.current;
      if (!currentArray || !currentDoc) return '';

      let newBlock: DocumentBlock;
      if (typeof typeOrBlock === 'object' && typeOrBlock !== null) {
        newBlock = {
          id: typeOrBlock.id || generateBlockId(),
          type: typeOrBlock.type || 'paragraph',
          content: typeOrBlock.content || '',
          checked: typeOrBlock.checked ?? false,
        };
      } else {
        newBlock = {
          id: generateBlockId(),
          type: typeOrBlock || 'paragraph',
          content: '',
          checked: false,
        };
      }

      currentDoc.transact(() => {
        if (!afterId) {
          currentArray.push([newBlock]);
        } else {
          const idx = findBlockIndex(currentArray, afterId);
          if (idx === -1) {
            currentArray.push([newBlock]);
          } else {
            currentArray.insert(idx + 1, [newBlock]);
          }
        }
      });

      return newBlock.id;
    },
    []
  );

  // Delete a block from Y.Doc (resets to single empty block if all deleted)
  const deleteBlock = useCallback((id: string) => {
    const currentArray = blocksArrayRef.current;
    const currentDoc = ydocRef.current;
    if (!currentArray || !currentDoc) return;

    currentDoc.transact(() => {
      if (currentArray.length <= 1) {
        currentArray.delete(0, currentArray.length);
        currentArray.push([
          {
            id: generateBlockId(),
            type: 'paragraph',
            content: '',
            checked: false,
          },
        ]);
        return;
      }

      const idx = findBlockIndex(currentArray, id);
      if (idx !== -1) {
        currentArray.delete(idx, 1);
      }
    });
  }, []);

  // Toggle checklist checkbox in Y.Doc
  const toggleChecklist = useCallback((id: string) => {
    const currentArray = blocksArrayRef.current;
    const currentDoc = ydocRef.current;
    if (!currentArray || !currentDoc) return;

    const idx = findBlockIndex(currentArray, id);
    if (idx === -1) return;

    const current = currentArray.get(idx);
    if (!current) return;

    currentDoc.transact(() => {
      currentArray.delete(idx, 1);
      currentArray.insert(idx, [
        {
          ...current,
          checked: !current.checked,
        },
      ]);
    });
  }, []);

  return {
    blocks,
    updateBlock,
    addBlock,
    deleteBlock,
    toggleChecklist,
    connectionStatus,
    isIndexedDbSynced,
    clientId,
  };
}

export default useDocumentYjs;
