export interface DocumentMeta {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
  createdBy: string;
  type: 'canvas' | 'doc' | 'file';
  fileData?: {
    name: string;
    size: number;
    mimeType: string;
    blobUrl?: string; // Storing as Data URL for now
  };
  isDeleted?: boolean;
  deletedAt?: number;
  lastModifiedBy?: { name: string; id: string };
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface UserPresence {
  userId: string;
  userName: string;
  userColor: string;
  currentDocId: string | null;
  lastActive: number;
}
