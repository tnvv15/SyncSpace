import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../lib/db/client';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All document routes require authentication
router.use(requireAuth);

/**
 * GET /api/documents
 * Returns all documents (including soft-deleted) for the authenticated user.
 * The frontend handles client-side filtering of isDeleted.
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json(documents);
  } catch (err) {
    console.error('List documents error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/documents
 * Creates a new document owned by the authenticated user.
 * Body: { title?: string, type: 'canvas' | 'doc' }
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { title, type } = req.body;

    if (!type || !['canvas', 'doc'].includes(type)) {
      res.status(400).json({ error: 'Invalid document type. Must be "canvas" or "doc".' });
      return;
    }

    const defaultTitle = type === 'canvas' ? 'Untitled Canvas' : 'Untitled Document';

    const document = await prisma.document.create({
      data: {
        title: (typeof title === 'string' && title.trim()) ? title.trim() : defaultTitle,
        type,
        userId,
      },
    });

    res.status(201).json(document);
  } catch (err) {
    console.error('Create document error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/documents/:id
 * Returns a single document. Verifies ownership.
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid document ID' });
      return;
    }

    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (document.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.status(200).json(document);
  } catch (err) {
    console.error('Get document error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/documents/:id
 * Updates a document's mutable fields. Verifies ownership.
 * Body: Partial<{ title, isFavorite, isDeleted, deletedAt }>
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid document ID' });
      return;
    }

    const existing = await prisma.document.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Whitelist only the fields that are allowed to be updated
    const { title, isFavorite, isDeleted, deletedAt } = req.body;

    const updateData: {
      title?: string;
      isFavorite?: boolean;
      isDeleted?: boolean;
      deletedAt?: Date | null;
    } = {};

    if (typeof title === 'string' && title.trim()) {
      updateData.title = title.trim();
    }
    if (typeof isFavorite === 'boolean') {
      updateData.isFavorite = isFavorite;
    }
    if (typeof isDeleted === 'boolean') {
      updateData.isDeleted = isDeleted;
    }
    if (isDeleted === true && deletedAt !== undefined) {
      updateData.deletedAt = deletedAt ? new Date(deletedAt) : new Date();
    }
    if (isDeleted === false) {
      updateData.deletedAt = null;
    }

    const updated = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update document error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/documents/:id
 * Permanently deletes a document. Verifies ownership.
 */
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid document ID' });
      return;
    }

    const existing = await prisma.document.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.document.delete({ where: { id } });

    res.status(204).send();
  } catch (err) {
    console.error('Delete document error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
export { router as documentsRouter };
