import type { DocumentMeta } from '../../types/dashboard';

/**
 * Shape of a document as returned by the API (dates are ISO strings, not ms timestamps).
 */
interface ApiDocument {
  id: string;
  title: string;
  type: 'canvas' | 'doc';
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/**
 * Converts an API document (ISO date strings) to the frontend DocumentMeta (ms timestamps).
 * The `createdBy` field is populated with a placeholder since the API doesn't return the
 * user's name in the document record. The WorkspaceContext fills this from the auth user.
 */
function toDocumentMeta(doc: ApiDocument, userName: string): DocumentMeta {
  return {
    id: doc.id,
    title: doc.title,
    type: doc.type,
    isFavorite: doc.isFavorite,
    isDeleted: doc.isDeleted,
    deletedAt: doc.deletedAt ? new Date(doc.deletedAt).getTime() : undefined,
    createdAt: new Date(doc.createdAt).getTime(),
    updatedAt: new Date(doc.updatedAt).getTime(),
    createdBy: userName,
  };
}

/**
 * Shared error handler: parses response JSON and throws with the server's error message.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = 'An unexpected error occurred';
    try {
      const data = await res.json();
      errorMessage = data.error || data.message || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

/**
 * GET /api/documents
 * Fetches all documents (including soft-deleted) for the authenticated user.
 */
export async function listDocumentsApi(userName: string): Promise<DocumentMeta[]> {
  const res = await fetch('/api/documents', {
    method: 'GET',
    credentials: 'include',
  });
  if (res.status === 401) return [];
  const docs = await handleResponse<ApiDocument[]>(res);
  return docs.map((d) => toDocumentMeta(d, userName));
}

/**
 * POST /api/documents
 * Creates a new document record in PostgreSQL.
 * Returns the full DocumentMeta with the server-generated UUID as the ID.
 */
export async function createDocumentApi(
  type: 'canvas' | 'doc',
  title: string,
  userName: string
): Promise<DocumentMeta> {
  const res = await fetch('/api/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ type, title }),
  });
  const doc = await handleResponse<ApiDocument>(res);
  return toDocumentMeta(doc, userName);
}

/**
 * PUT /api/documents/:id
 * Updates mutable fields of a document.
 */
export async function updateDocumentApi(
  id: string,
  patch: Partial<{ title: string; isFavorite: boolean; isDeleted: boolean; deletedAt: string | null }>,
  userName: string
): Promise<DocumentMeta> {
  const res = await fetch(`/api/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(patch),
  });
  const doc = await handleResponse<ApiDocument>(res);
  return toDocumentMeta(doc, userName);
}

/**
 * DELETE /api/documents/:id
 * Permanently deletes a document.
 */
export async function deleteDocumentApi(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok && res.status !== 404) {
    throw new Error('Failed to delete document');
  }
}
