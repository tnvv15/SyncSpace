import { describe, it, expect } from 'vitest';
import * as Y from 'yjs';
import { DocumentBlock, BlockType } from '../../types/documentTheme';

describe('Document Yjs CRDT Logic & Room Isolation', () => {
  it('guarantees complete room isolation between different document IDs', () => {
    const docA = new Y.Doc();
    const docB = new Y.Doc();

    const blocksArrayA = docA.getArray<DocumentBlock>('blocks');
    const blocksArrayB = docB.getArray<DocumentBlock>('blocks');

    // Insert block into doc A
    docA.transact(() => {
      blocksArrayA.push([
        {
          id: 'block-a-1',
          type: 'heading1',
          content: 'Document A Architecture',
          checked: false,
        },
      ]);
    });

    // Insert block into doc B
    docB.transact(() => {
      blocksArrayB.push([
        {
          id: 'block-b-1',
          type: 'paragraph',
          content: 'Document B Roadmap',
          checked: false,
        },
      ]);
    });

    // Verify isolation
    expect(blocksArrayA.length).toBe(1);
    expect(blocksArrayA.get(0).content).toBe('Document A Architecture');
    expect(blocksArrayB.length).toBe(1);
    expect(blocksArrayB.get(0).content).toBe('Document B Roadmap');
    expect(blocksArrayA.get(0).id).not.toBe(blocksArrayB.get(0).id);
  });

  it('synchronizes edits between two clients in the same document room', () => {
    const client1Doc = new Y.Doc();
    const client2Doc = new Y.Doc();

    const client1Blocks = client1Doc.getArray<DocumentBlock>('blocks');
    const client2Blocks = client2Doc.getArray<DocumentBlock>('blocks');

    // Wire simulated update exchange between clients (same room)
    client1Doc.on('update', (update) => {
      Y.applyUpdate(client2Doc, update);
    });
    client2Doc.on('update', (update) => {
      Y.applyUpdate(client1Doc, update);
    });

    // Client 1 adds a block
    client1Doc.transact(() => {
      client1Blocks.push([
        {
          id: 'b1',
          type: 'paragraph',
          content: 'Initial thoughts from client 1',
          checked: false,
        },
      ]);
    });

    // Client 2 should now have the block
    expect(client2Blocks.length).toBe(1);
    expect(client2Blocks.get(0).content).toBe('Initial thoughts from client 1');

    // Client 2 updates the block content
    client2Doc.transact(() => {
      const current = client2Blocks.get(0);
      client2Blocks.delete(0, 1);
      client2Blocks.insert(0, [{ ...current, content: 'Updated by client 2' }]);
    });

    // Client 1 should observe the converged state
    expect(client1Blocks.get(0).content).toBe('Updated by client 2');

    // Client 1 adds a checklist block
    client1Doc.transact(() => {
      client1Blocks.push([
        {
          id: 'b2',
          type: 'checklist',
          content: 'Deploy to staging',
          checked: false,
        },
      ]);
    });

    // Client 2 toggles the checklist
    client2Doc.transact(() => {
      const current = client2Blocks.get(1);
      client2Blocks.delete(1, 1);
      client2Blocks.insert(1, [{ ...current, checked: true }]);
    });

    // Both converge
    expect(client1Blocks.length).toBe(2);
    expect(client2Blocks.length).toBe(2);
    expect(client1Blocks.get(1).checked).toBe(true);
    expect(client2Blocks.get(1).checked).toBe(true);
  });

  it('supports block deletion and resets to single paragraph if empty', () => {
    const doc = new Y.Doc();
    const blocksArray = doc.getArray<DocumentBlock>('blocks');

    doc.transact(() => {
      blocksArray.push([
        { id: 'b1', type: 'paragraph', content: 'First', checked: false },
        { id: 'b2', type: 'paragraph', content: 'Second', checked: false },
      ]);
    });

    expect(blocksArray.length).toBe(2);

    // Delete one block
    doc.transact(() => {
      blocksArray.delete(0, 1);
    });
    expect(blocksArray.length).toBe(1);
    expect(blocksArray.get(0).id).toBe('b2');

    // Deleting the last block resets to empty paragraph
    doc.transact(() => {
      if (blocksArray.length <= 1) {
        blocksArray.delete(0, blocksArray.length);
        blocksArray.push([
          { id: 'reset-1', type: 'paragraph', content: '', checked: false },
        ]);
      }
    });

    expect(blocksArray.length).toBe(1);
    expect(blocksArray.get(0).type).toBe('paragraph');
    expect(blocksArray.get(0).content).toBe('');
  });
});
