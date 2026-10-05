import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../index';
import { prisma } from '../../lib/db/client';
import { AUTH_COOKIE_NAME } from '../../lib/auth/jwt';

describe('Document Sharing API Integration Tests (/api/documents)', { timeout: 30000 }, () => {

  const ownerUser = {
    email: 'owner-share-test@syncspace.dev',
    password: 'Password123!',
    name: 'Owner User',
  };

  const recipientUser = {
    email: 'recipient-share-test@syncspace.dev',
    password: 'Password123!',
    name: 'Recipient User',
  };

  const strangerUser = {
    email: 'stranger-share-test@syncspace.dev',
    password: 'Password123!',
    name: 'Stranger User',
  };

  let ownerCookie: string;
  let recipientCookie: string;
  let strangerCookie: string;
  let recipientId: string;
  let testDocId: string;

  const extractCookie = (res: request.Response): string => {
    const cookies = res.headers['set-cookie'];
    if (!cookies) return '';
    const cookieArr = Array.isArray(cookies) ? cookies : [cookies];
    const match = cookieArr.find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
    return match ? match.split(';')[0] : '';
  };

  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [ownerUser.email, recipientUser.email, strangerUser.email],
        },
      },
    });

    // Register Owner
    const ownerRes = await request(app).post('/api/auth/register').send(ownerUser);
    ownerCookie = extractCookie(ownerRes);

    // Register Recipient
    const recipientRes = await request(app).post('/api/auth/register').send(recipientUser);
    recipientCookie = extractCookie(recipientRes);
    recipientId = recipientRes.body.id;

    // Register Stranger
    const strangerRes = await request(app).post('/api/auth/register').send(strangerUser);
    strangerCookie = extractCookie(strangerRes);

    // Create a document as Owner
    const docRes = await request(app)
      .post('/api/documents')
      .set('Cookie', [ownerCookie])
      .send({ type: 'doc', title: 'Shared Architecture Plan' });

    expect(docRes.status).toBe(201);
    testDocId = docRes.body.id;
  }, 30000);

  afterAll(async () => {
    // Cascade deletes shares when document or users are deleted
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [ownerUser.email, recipientUser.email, strangerUser.email],
        },
      },
    });
  }, 30000);



  // Scenario I: Existing owner document CRUD
  describe('Scenario I: Existing owner document CRUD', () => {
    it('owner can retrieve, update, and list their own document', async () => {
      // Retrieve
      const getRes = await request(app)
        .get(`/api/documents/${testDocId}`)
        .set('Cookie', [ownerCookie]);
      expect(getRes.status).toBe(200);
      expect(getRes.body.permission).toBe('OWNER');

      // Update title
      const putRes = await request(app)
        .put(`/api/documents/${testDocId}`)
        .set('Cookie', [ownerCookie])
        .send({ title: 'Shared Architecture Plan - Revised' });
      expect(putRes.status).toBe(200);
      expect(putRes.body.title).toBe('Shared Architecture Plan - Revised');

      // List documents
      const listRes = await request(app)
        .get('/api/documents')
        .set('Cookie', [ownerCookie]);
      expect(listRes.status).toBe(200);
      expect(listRes.body.some((d: any) => d.id === testDocId)).toBe(true);
    });
  });

  // Scenario A: Owner shares document with Viewer -> recipient sees it under Shared With Me
  describe('Scenario A: Owner shares document with Viewer', () => {
    it('recipient sees shared document in shared-with-me and can view but cannot edit or delete', async () => {
      // Owner shares as VIEWER
      const shareRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: recipientUser.email, permission: 'VIEWER' });
      expect(shareRes.status).toBe(201);
      expect(shareRes.body.permission).toBe('VIEWER');

      // Recipient checks shared-with-me
      const sharedRes = await request(app)
        .get('/api/documents/shared-with-me')
        .set('Cookie', [recipientCookie]);
      expect(sharedRes.status).toBe(200);
      const found = sharedRes.body.find((d: any) => d.id === testDocId);
      expect(found).toBeDefined();
      expect(found.permission).toBe('VIEWER');
      expect(found.owner.email).toBe(ownerUser.email);

      // Recipient can open the document
      const docRes = await request(app)
        .get(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie]);
      expect(docRes.status).toBe(200);
      expect(docRes.body.permission).toBe('VIEWER');

      // Recipient as VIEWER cannot update metadata
      const putRes = await request(app)
        .put(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie])
        .send({ title: 'Viewer Attempted Change' });
      expect(putRes.status).toBe(403);

      // Recipient as VIEWER cannot delete document
      const delRes = await request(app)
        .delete(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie]);
      expect(delRes.status).toBe(403);
    });
  });

  // Scenario C: Owner changes Viewer -> Editor -> permission updates
  describe('Scenario C: Owner changes Viewer -> Editor', () => {
    it('updates permission to EDITOR and allows recipient to edit document title', async () => {
      // Owner changes permission to EDITOR
      const patchRes = await request(app)
        .patch(`/api/documents/${testDocId}/share/${recipientId}`)
        .set('Cookie', [ownerCookie])
        .send({ permission: 'EDITOR' });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.permission).toBe('EDITOR');

      // Recipient checks shared-with-me
      const sharedRes = await request(app)
        .get('/api/documents/shared-with-me')
        .set('Cookie', [recipientCookie]);
      const found = sharedRes.body.find((d: any) => d.id === testDocId);
      expect(found.permission).toBe('EDITOR');

      // Recipient as EDITOR can update document title
      const putRes = await request(app)
        .put(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie])
        .send({ title: 'Editor Modified Title' });
      expect(putRes.status).toBe(200);
      expect(putRes.body.title).toBe('Editor Modified Title');

      // Recipient as EDITOR cannot delete document
      const delRes = await request(app)
        .delete(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie]);
      expect(delRes.status).toBe(403);
    });
  });

  // Scenario D: Owner changes Editor -> Viewer -> permission updates
  describe('Scenario D: Owner changes Editor -> Viewer', () => {
    it('demotes permission back to VIEWER and revokes edit permissions', async () => {
      // Owner changes permission back to VIEWER
      const patchRes = await request(app)
        .patch(`/api/documents/${testDocId}/share/${recipientId}`)
        .set('Cookie', [ownerCookie])
        .send({ permission: 'VIEWER' });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.permission).toBe('VIEWER');

      // Recipient can no longer update title
      const putRes = await request(app)
        .put(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie])
        .send({ title: 'Viewer Attempt After Demotion' });
      expect(putRes.status).toBe(403);
    });
  });

  // Scenario E: Owner removes user -> recipient no longer sees the document
  describe('Scenario E: Owner removes user', () => {
    it('revokes access and recipient no longer sees or can open document', async () => {
      // Owner deletes share
      const delShareRes = await request(app)
        .delete(`/api/documents/${testDocId}/share/${recipientId}`)
        .set('Cookie', [ownerCookie]);
      expect(delShareRes.status).toBe(200);

      // Recipient shared-with-me no longer includes document
      const sharedRes = await request(app)
        .get('/api/documents/shared-with-me')
        .set('Cookie', [recipientCookie]);
      expect(sharedRes.body.some((d: any) => d.id === testDocId)).toBe(false);

      // Recipient can no longer open document
      const docRes = await request(app)
        .get(`/api/documents/${testDocId}`)
        .set('Cookie', [recipientCookie]);
      expect(docRes.status).toBe(403);
    });
  });

  // Scenario B: Owner shares document with Editor directly
  describe('Scenario B: Owner shares document with Editor directly', () => {
    it('grants EDITOR permission immediately', async () => {
      const shareRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: recipientUser.email, permission: 'EDITOR' });
      expect(shareRes.status).toBe(201);
      expect(shareRes.body.permission).toBe('EDITOR');

      const sharedRes = await request(app)
        .get('/api/documents/shared-with-me')
        .set('Cookie', [recipientCookie]);
      const found = sharedRes.body.find((d: any) => d.id === testDocId);
      expect(found).toBeDefined();
      expect(found.permission).toBe('EDITOR');
    });
  });

  // Scenario F: Non-owner attempts to share -> rejected with 403
  describe('Scenario F: Non-owner attempts to share', () => {
    it('rejects share attempts from non-owners with 403', async () => {
      // Stranger attempts to share owner document
      const strangerShareRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [strangerCookie])
        .send({ email: recipientUser.email, permission: 'VIEWER' });
      expect(strangerShareRes.status).toBe(403);

      // Shared EDITOR attempts to share with someone else
      const editorShareRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [recipientCookie])
        .send({ email: strangerUser.email, permission: 'VIEWER' });
      expect(editorShareRes.status).toBe(403);

      // Shared EDITOR attempts to manage share permissions
      const editorPatchRes = await request(app)
        .patch(`/api/documents/${testDocId}/share/${recipientId}`)
        .set('Cookie', [recipientCookie])
        .send({ permission: 'VIEWER' });
      expect(editorPatchRes.status).toBe(403);
    });
  });

  // Scenario G: User attempts to access an unshared private document
  describe('Scenario G: Accessing unshared private document', () => {
    it('returns 403 for unauthorized users and 404 for nonexistent documents', async () => {
      // Stranger attempts to get unshared document
      const getRes = await request(app)
        .get(`/api/documents/${testDocId}`)
        .set('Cookie', [strangerCookie]);
      expect(getRes.status).toBe(403);

      // Stranger attempts to update unshared document
      const putRes = await request(app)
        .put(`/api/documents/${testDocId}`)
        .set('Cookie', [strangerCookie])
        .send({ title: 'Hacked' });
      expect(putRes.status).toBe(403);

      // Stranger attempts to delete unshared document
      const delRes = await request(app)
        .delete(`/api/documents/${testDocId}`)
        .set('Cookie', [strangerCookie]);
      expect(delRes.status).toBe(403);

      // Non-existent document ID returns 404
      const nonExistentRes = await request(app)
        .get('/api/documents/00000000-0000-0000-0000-000000000000')
        .set('Cookie', [ownerCookie]);
      expect(nonExistentRes.status).toBe(404);
    });
  });

  // Scenario H: Duplicate share and edge cases
  describe('Scenario H: Duplicate share and edge cases', () => {
    it('returns 409 Conflict when attempting to share with same user twice', async () => {
      // Document is already shared with recipientUser
      const duplicateRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: recipientUser.email, permission: 'VIEWER' });
      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.error).toContain('already shared');
    });

    it('returns 400 Bad Request when owner attempts to share with themselves', async () => {
      const selfRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: ownerUser.email, permission: 'VIEWER' });
      expect(selfRes.status).toBe(400);
      expect(selfRes.body.error).toContain('yourself');
    });

    it('returns 404 Not Found when sharing with non-existent user email', async () => {
      const notFoundRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: 'nonexistent-user-12345@syncspace.dev', permission: 'VIEWER' });
      expect(notFoundRes.status).toBe(404);
      expect(notFoundRes.body.error).toContain('does not exist');
    });

    it('returns 400 Bad Request when sharing with invalid permission', async () => {
      const invalidRes = await request(app)
        .post(`/api/documents/${testDocId}/share`)
        .set('Cookie', [ownerCookie])
        .send({ email: strangerUser.email, permission: 'ADMIN' });
      expect(invalidRes.status).toBe(400);
    });
  });
});
